package com.uchk.gap.document.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.SecurityUtils;
import com.uchk.gap.document.dto.DocumentDto;
import com.uchk.gap.document.entity.Document;
import com.uchk.gap.document.repository.DocumentRepository;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain");

    private final DocumentRepository repository;
    private final UtilisateurRepository utilisateurRepository;
    private final JournalAccesService journalAccesService;
    private final Path uploadRoot;

    public DocumentStorageService(
            DocumentRepository repository,
            UtilisateurRepository utilisateurRepository,
            JournalAccesService journalAccesService,
            @Value("${app.storage.upload-dir:uploads}") String uploadDir) {
        this.repository = repository;
        this.utilisateurRepository = utilisateurRepository;
        this.journalAccesService = journalAccesService;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Transactional
    public DocumentDto store(MultipartFile file, String module, Long entiteId) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Fichier vide");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Type de fichier non autorise");
        }

        try {
            Files.createDirectories(uploadRoot);
            String extension = extractExtension(file.getOriginalFilename());
            String storedName = UUID.randomUUID() + extension;
            Path target = uploadRoot.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setNom(sanitizeFilename(file.getOriginalFilename()));
            document.setTypeMime(contentType);
            document.setCheminStockage(target.toString());
            document.setUrl("/api/documents/placeholder/file");
            document.setTaille(file.getSize());
            document.setModule(module);
            document.setEntiteId(entiteId);

            String email = SecurityUtils.currentUserEmail();
            if (email != null) {
                Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);
                document.setUploadedBy(user);
            }

            Document saved = repository.save(document);
            saved.setUrl("/api/documents/" + saved.getId() + "/file");
            saved = repository.save(saved);
            return DocumentDto.from(saved);
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "Echec du stockage");
        }
    }

    @Transactional(readOnly = true)
    public StoredFile load(Long id) {
        Document document = repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Document introuvable"));
        try {
            Path path = Path.of(document.getCheminStockage()).normalize();
            if (!Files.exists(path)) {
                throw new BusinessException(HttpStatus.NOT_FOUND, "Fichier introuvable");
            }
            Resource resource = new UrlResource(path.toUri());
            MediaType mediaType = document.getTypeMime() != null
                    ? MediaType.parseMediaType(document.getTypeMime())
                    : MediaType.APPLICATION_OCTET_STREAM;
            journalAccesService.logDownload(document);
            return new StoredFile(resource, document.getNom(), mediaType);
        } catch (IOException ex) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Fichier introuvable");
        }
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "document";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public record StoredFile(Resource resource, String filename, MediaType mediaType) {
    }
}

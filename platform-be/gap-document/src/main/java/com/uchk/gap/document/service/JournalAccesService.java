package com.uchk.gap.document.service;

import com.uchk.gap.common.SecurityUtils;
import com.uchk.gap.document.dto.JournalAccesDocumentDto;
import com.uchk.gap.document.entity.Document;
import com.uchk.gap.document.entity.JournalAccesDocument;
import com.uchk.gap.document.repository.JournalAccesDocumentRepository;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JournalAccesService {

    private final JournalAccesDocumentRepository repository;
    private final UtilisateurRepository utilisateurRepository;

    public JournalAccesService(
            JournalAccesDocumentRepository repository,
            UtilisateurRepository utilisateurRepository) {
        this.repository = repository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional(readOnly = true)
    public List<JournalAccesDocumentDto> recent() {
        return repository.findTop100ByOrderByAccedeLeDesc().stream()
                .map(JournalAccesDocumentDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JournalAccesDocumentDto> findAll() {
        return repository.findAllByOrderByAccedeLeDesc().stream()
                .map(JournalAccesDocumentDto::from)
                .toList();
    }

    @Transactional
    public void logDownload(Document document) {
        JournalAccesDocument entry = new JournalAccesDocument();
        entry.setDocument(document);
        entry.setAction("DOWNLOAD");
        String email = SecurityUtils.currentUserEmail();
        entry.setEmail(email);
        if (email != null) {
            utilisateurRepository.findByEmail(email).ifPresent(entry::setUtilisateur);
        }
        repository.save(entry);
    }
}

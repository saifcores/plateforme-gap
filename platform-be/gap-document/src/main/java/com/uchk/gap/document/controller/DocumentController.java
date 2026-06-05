package com.uchk.gap.document.controller;

import com.uchk.gap.document.dto.DocumentDto;
import com.uchk.gap.document.service.DocumentStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentStorageService service;

    public DocumentController(DocumentStorageService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentDto upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "module", required = false) String module,
            @RequestParam(value = "entiteId", required = false) Long entiteId) {
        return service.store(file, module, entiteId);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<org.springframework.core.io.Resource> download(@PathVariable Long id) {
        DocumentStorageService.StoredFile stored = service.load(id);
        return ResponseEntity.ok()
                .contentType(stored.mediaType())
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + stored.filename() + "\"")
                .body(stored.resource());
    }
}

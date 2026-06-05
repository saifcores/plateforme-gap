package com.uchk.gap.document.controller;

import com.uchk.gap.document.dto.JournalAccesDocumentDto;
import com.uchk.gap.document.service.JournalAccesExportService;
import com.uchk.gap.document.service.JournalAccesService;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/journal-acces-documents")
@PreAuthorize("hasRole('ADMIN')")
public class JournalAccesController {

    private final JournalAccesService service;
    private final JournalAccesExportService exportService;

    public JournalAccesController(
            JournalAccesService service,
            JournalAccesExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<JournalAccesDocumentDto> recent() {
        return service.recent();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] content = exportService.exportExcel(service.findAll());
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=journal-acces-documents.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument"
                                + ".spreadsheetml.sheet"))
                .body(content);
    }
}

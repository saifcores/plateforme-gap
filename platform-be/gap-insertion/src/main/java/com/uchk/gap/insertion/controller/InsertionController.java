package com.uchk.gap.insertion.controller;

import com.uchk.gap.insertion.dto.InsertionDto;
import com.uchk.gap.insertion.dto.InsertionStatsDto;
import com.uchk.gap.insertion.service.InsertionExportService;
import com.uchk.gap.insertion.service.InsertionService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insertions")
public class InsertionController {

    private final InsertionService service;
    private final InsertionExportService exportService;

    public InsertionController(InsertionService service, InsertionExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping("/moi")
    @PreAuthorize("hasRole('ETUDIANT')")
    public InsertionDto findMine(Principal principal) {
        return service.findMine(principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION','ADMINISTRATIF')")
    public List<InsertionDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION','ADMINISTRATIF')")
    public InsertionStatsDto stats() {
        return service.stats();
    }

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION','ADMINISTRATIF')")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] content = exportService.exportPdf(service.stats(), service.findAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stats-insertion.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(content);
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION','ADMINISTRATIF')")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] content = exportService.exportExcel(service.stats(), service.findAll());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stats-insertion.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(content);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION','ADMINISTRATIF')")
    public InsertionDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION')")
    @ResponseStatus(HttpStatus.CREATED)
    public InsertionDto create(@Valid @RequestBody InsertionDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION')")
    public InsertionDto update(@PathVariable Long id, @Valid @RequestBody InsertionDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.uchk.gap.administration.controller;

import com.uchk.gap.administration.dto.BudgetDto;
import com.uchk.gap.administration.service.BudgetExportService;
import com.uchk.gap.administration.service.BudgetService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/budgets")
@PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
public class BudgetController {

    private final BudgetService service;
    private final BudgetExportService exportService;

    public BudgetController(BudgetService service, BudgetExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BudgetDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public BudgetDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id) {
        BudgetDto budget = service.findById(id);
        byte[] content = exportService.exportPdf(budget);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=budget-" + budget.annee() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(content);
    }

    @GetMapping("/{id}/export/excel")
    public ResponseEntity<byte[]> exportExcel(@PathVariable Long id) {
        BudgetDto budget = service.findById(id);
        byte[] content = exportService.exportExcel(budget);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=budget-" + budget.annee() + ".xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(content);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetDto create(@Valid @RequestBody BudgetDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public BudgetDto update(@PathVariable Long id, @Valid @RequestBody BudgetDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.uchk.gap.communication.controller;

import com.uchk.gap.common.PageResponse;
import com.uchk.gap.communication.dto.CompteRenduDto;
import com.uchk.gap.communication.dto.CompteRenduRequest;
import com.uchk.gap.communication.service.CompteRenduService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comptes-rendus")
public class CompteRenduController {

    private final CompteRenduService service;

    public CompteRenduController(CompteRenduService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<CompteRenduDto> search(
            Principal principal,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String auteur,
            @RequestParam(required = false) LocalDate dateFrom,
            @RequestParam(required = false) LocalDate dateTo,
            @PageableDefault(size = 10, sort = "dateEvent", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.searchVisible(
                principal.getName(), q, type, auteur, dateFrom, dateTo, pageable);
    }

    @GetMapping("/{id}")
    public CompteRenduDto findById(@PathVariable Long id, Principal principal) {
        return service.findById(id, principal.getName());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    @ResponseStatus(HttpStatus.CREATED)
    public CompteRenduDto create(@Valid @RequestBody CompteRenduRequest request, Principal principal) {
        return service.create(request, principal.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public CompteRenduDto update(@PathVariable Long id, @Valid @RequestBody CompteRenduRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

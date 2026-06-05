package com.uchk.gap.formation.controller;

import com.uchk.gap.common.PageResponse;
import com.uchk.gap.formation.dto.FormateurDto;
import com.uchk.gap.formation.dto.FormateurRequest;
import com.uchk.gap.formation.service.FormateurService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/formateurs")
public class FormateurController {

    private final FormateurService service;

    public FormateurController(FormateurService service) {
        this.service = service;
    }

    @GetMapping("/options")
    public List<FormateurDto> options() {
        return service.findAll();
    }

    @GetMapping
    public PageResponse<FormateurDto> search(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "nom") Pageable pageable) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id}")
    public FormateurDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    @ResponseStatus(HttpStatus.CREATED)
    public FormateurDto create(@Valid @RequestBody FormateurRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public FormateurDto update(@PathVariable Long id, @Valid @RequestBody FormateurRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF','RESPONSABLE_FORMATION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

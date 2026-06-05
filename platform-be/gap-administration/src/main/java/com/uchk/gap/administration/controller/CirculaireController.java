package com.uchk.gap.administration.controller;

import com.uchk.gap.administration.dto.CirculaireDto;
import com.uchk.gap.administration.service.CirculaireService;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/circulaires")
public class CirculaireController {

    private final CirculaireService service;

    public CirculaireController(CirculaireService service) {
        this.service = service;
    }

    @GetMapping
    public List<CirculaireDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CirculaireDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    @ResponseStatus(HttpStatus.CREATED)
    public CirculaireDto create(@Valid @RequestBody CirculaireDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    public CirculaireDto update(@PathVariable Long id, @Valid @RequestBody CirculaireDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATIF')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

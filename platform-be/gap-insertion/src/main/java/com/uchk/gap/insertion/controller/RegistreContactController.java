package com.uchk.gap.insertion.controller;

import com.uchk.gap.insertion.dto.RegistreContactDto;
import com.uchk.gap.insertion.service.RegistreContactService;
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
@RequestMapping("/api/registre-contacts")
@PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION')")
public class RegistreContactController {

    private final RegistreContactService service;

    public RegistreContactController(RegistreContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<RegistreContactDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RegistreContactDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RegistreContactDto create(@Valid @RequestBody RegistreContactDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public RegistreContactDto update(@PathVariable Long id, @Valid @RequestBody RegistreContactDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

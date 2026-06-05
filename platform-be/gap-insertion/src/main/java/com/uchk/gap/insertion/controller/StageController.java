package com.uchk.gap.insertion.controller;

import com.uchk.gap.insertion.dto.StageDto;
import com.uchk.gap.insertion.service.StageService;
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
@RequestMapping("/api/stages")
@PreAuthorize("hasAnyRole('ADMIN','APPUI_INSERTION')")
public class StageController {

    private final StageService service;

    public StageController(StageService service) {
        this.service = service;
    }

    @GetMapping
    public List<StageDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public StageDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StageDto create(@Valid @RequestBody StageDto.Request request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public StageDto update(@PathVariable Long id, @Valid @RequestBody StageDto.Request request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

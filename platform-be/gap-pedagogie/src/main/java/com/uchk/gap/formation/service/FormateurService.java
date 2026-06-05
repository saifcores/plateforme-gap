package com.uchk.gap.formation.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.PageResponse;
import com.uchk.gap.formation.dto.FormateurDto;
import com.uchk.gap.formation.dto.FormateurRequest;
import com.uchk.gap.formation.entity.Formateur;
import com.uchk.gap.formation.repository.FormateurRepository;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FormateurService {

    private final FormateurRepository repository;

    public FormateurService(FormateurRepository repository) {
        this.repository = repository;
    }

    public List<FormateurDto> findAll() {
        return repository.findAllByOrderByNomAsc().stream()
                .map(FormateurDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<FormateurDto> search(String q, Pageable pageable) {
        return PageResponse.from(
                repository.search(q, pageable).map(FormateurDto::from));
    }

    @Transactional
    public FormateurDto create(FormateurRequest request) {
        Formateur formateur = new Formateur();
        apply(formateur, request);
        return FormateurDto.from(repository.save(formateur));
    }

    @Transactional(readOnly = true)
    public FormateurDto findById(Long id) {
        return FormateurDto.from(getOrThrow(id));
    }

    @Transactional
    public FormateurDto update(Long id, FormateurRequest request) {
        Formateur formateur = getOrThrow(id);
        apply(formateur, request);
        return FormateurDto.from(repository.save(formateur));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    public Formateur getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Formateur introuvable"));
    }

    private void apply(Formateur formateur, FormateurRequest request) {
        formateur.setNom(request.nom());
        formateur.setPrenom(request.prenom());
        formateur.setEmail(request.email());
        formateur.setType(request.type());
        formateur.setSpecialite(request.specialite());
        formateur.setGrade(request.grade());
    }
}

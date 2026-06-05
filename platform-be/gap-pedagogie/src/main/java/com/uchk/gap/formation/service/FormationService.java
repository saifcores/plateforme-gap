package com.uchk.gap.formation.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.PageResponse;
import com.uchk.gap.formation.dto.FormationDto;
import com.uchk.gap.formation.dto.FormationRequest;
import com.uchk.gap.formation.entity.Formation;
import com.uchk.gap.formation.repository.FormationRepository;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FormationService {

    private final FormationRepository repository;

    public FormationService(FormationRepository repository) {
        this.repository = repository;
    }

    public List<FormationDto> findAll() {
        return repository.findByDeletedFalseOrderByIntituleAsc().stream()
                .map(FormationDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<FormationDto> search(String q, Pageable pageable) {
        return PageResponse.from(
                repository.search(q, pageable).map(FormationDto::from));
    }

    public FormationDto findById(Long id) {
        return FormationDto.from(getOrThrow(id));
    }

    @Transactional
    public FormationDto create(FormationRequest request) {
        Formation formation = new Formation();
        apply(formation, request);
        return FormationDto.from(repository.save(formation));
    }

    @Transactional
    public FormationDto update(Long id, FormationRequest request) {
        Formation formation = getOrThrow(id);
        apply(formation, request);
        return FormationDto.from(repository.save(formation));
    }

    @Transactional
    public void delete(Long id) {
        Formation formation = getOrThrow(id);
        formation.setDeleted(true);
        repository.save(formation);
    }

    public Formation getOrThrow(Long id) {
        Formation formation = repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Formation introuvable"));
        if (formation.isDeleted()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Formation introuvable");
        }
        return formation;
    }

    private void apply(Formation formation, FormationRequest request) {
        formation.setIntitule(request.intitule());
        formation.setType(request.type());
        formation.setNiveau(request.niveau());
        formation.setDateDebut(request.dateDebut());
        formation.setDateFin(request.dateFin());
        formation.setTypeFinancement(request.typeFinancement());
        formation.setMontantFinancement(request.montantFinancement());
        formation.setDescription(request.description());
    }
}

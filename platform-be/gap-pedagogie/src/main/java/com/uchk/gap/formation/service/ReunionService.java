package com.uchk.gap.formation.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.formation.dto.ReunionDto;
import com.uchk.gap.formation.dto.ReunionRequest;
import com.uchk.gap.formation.entity.Formation;
import com.uchk.gap.formation.entity.Reunion;
import com.uchk.gap.formation.repository.ReunionRepository;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReunionService {

    private static final Set<String> TYPES = Set.of(
            "TUTORAT",
            "PREPARATION_COURS",
            "PREPARATION_EVALUATION");

    private final ReunionRepository repository;
    private final FormationService formationService;

    public ReunionService(ReunionRepository repository, FormationService formationService) {
        this.repository = repository;
        this.formationService = formationService;
    }

    @Transactional(readOnly = true)
    public List<ReunionDto> findByFormation(Long formationId) {
        formationService.getOrThrow(formationId);
        return repository.findByFormationIdOrderByDateReunionDesc(formationId).stream()
                .map(ReunionDto::from)
                .toList();
    }

    @Transactional
    public ReunionDto create(Long formationId, ReunionRequest request) {
        validateType(request.type());
        Formation formation = formationService.getOrThrow(formationId);
        Reunion reunion = new Reunion();
        reunion.setFormation(formation);
        apply(reunion, request);
        return ReunionDto.from(repository.save(reunion));
    }

    @Transactional
    public ReunionDto update(Long formationId, Long reunionId, ReunionRequest request) {
        validateType(request.type());
        Reunion reunion = getOrThrow(reunionId);
        if (reunion.getFormation() == null
                || !reunion.getFormation().getId().equals(formationId)) {
            throw new BusinessException(
                    HttpStatus.BAD_REQUEST, "Reunion non rattachee a cette formation");
        }
        apply(reunion, request);
        return ReunionDto.from(repository.save(reunion));
    }

    @Transactional
    public void delete(Long reunionId) {
        repository.delete(getOrThrow(reunionId));
    }

    private Reunion getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Reunion introuvable"));
    }

    private void apply(Reunion reunion, ReunionRequest request) {
        reunion.setType(request.type());
        reunion.setObjet(request.objet());
        reunion.setDateReunion(request.dateReunion());
        reunion.setLieu(request.lieu());
        reunion.setCompteRendu(request.compteRendu());
    }

    private void validateType(String type) {
        if (!TYPES.contains(type)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Type de reunion invalide");
        }
    }
}

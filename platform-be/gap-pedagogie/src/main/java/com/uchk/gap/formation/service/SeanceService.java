package com.uchk.gap.formation.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.formation.dto.SeanceDto;
import com.uchk.gap.formation.dto.SeanceRequest;
import com.uchk.gap.formation.entity.Formation;
import com.uchk.gap.formation.entity.Seance;
import com.uchk.gap.formation.repository.SeanceRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeanceService {

    private final SeanceRepository repository;
    private final FormationService formationService;
    private final FormateurService formateurService;

    public SeanceService(SeanceRepository repository,
            FormationService formationService,
            FormateurService formateurService) {
        this.repository = repository;
        this.formationService = formationService;
        this.formateurService = formateurService;
    }

    public List<SeanceDto> findByFormation(Long formationId) {
        formationService.getOrThrow(formationId);
        return repository.findByFormationIdOrderByDateSeanceAscHeureDebutAsc(formationId).stream()
                .map(SeanceDto::from)
                .toList();
    }

    @Transactional
    public SeanceDto create(Long formationId, SeanceRequest request) {
        Formation formation = formationService.getOrThrow(formationId);
        Seance seance = new Seance();
        seance.setFormation(formation);
        apply(seance, request);
        return SeanceDto.from(repository.save(seance));
    }

    @Transactional
    public SeanceDto update(Long formationId, Long seanceId, SeanceRequest request) {
        Seance seance = getOrThrow(seanceId);
        if (!seance.getFormation().getId().equals(formationId)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Seance non rattachee a cette formation");
        }
        apply(seance, request);
        return SeanceDto.from(repository.save(seance));
    }

    @Transactional
    public void delete(Long seanceId) {
        repository.delete(getOrThrow(seanceId));
    }

    private Seance getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Seance introuvable"));
    }

    private void apply(Seance seance, SeanceRequest request) {
        seance.setMatiere(request.matiere());
        seance.setType(request.type());
        seance.setDateSeance(request.dateSeance());
        seance.setHeureDebut(request.heureDebut());
        seance.setHeureFin(request.heureFin());
        seance.setSalle(request.salle());
        if (request.formateurId() != null) {
            seance.setFormateur(formateurService.getOrThrow(request.formateurId()));
        } else {
            seance.setFormateur(null);
        }
    }
}

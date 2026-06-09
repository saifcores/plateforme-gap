package com.uchk.gap.formation.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.formation.dto.FormationFormateurDto;
import com.uchk.gap.formation.dto.StatGenreDto;
import com.uchk.gap.formation.entity.Formateur;
import com.uchk.gap.formation.entity.FormationFormateur;
import com.uchk.gap.formation.repository.FormationFormateurRepository;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FormationFormateurService {

    private final FormationFormateurRepository repository;
    private final FormationService formationService;
    private final FormateurService formateurService;
    private final EtudiantRepository etudiantRepository;

    public FormationFormateurService(
            FormationFormateurRepository repository,
            FormationService formationService,
            FormateurService formateurService,
            EtudiantRepository etudiantRepository) {
        this.repository = repository;
        this.formationService = formationService;
        this.formateurService = formateurService;
        this.etudiantRepository = etudiantRepository;
    }

    @Transactional(readOnly = true)
    public List<FormationFormateurDto> findByFormation(Long formationId) {
        formationService.getOrThrow(formationId);
        return repository.findByFormationId(formationId).stream()
                .map(FormationFormateurDto::from)
                .toList();
    }

    @Transactional
    public FormationFormateurDto assign(
            Long formationId, Long formateurId, String roleDansFormation) {
        formationService.getOrThrow(formationId);
        Formateur formateur = formateurService.getOrThrow(formateurId);
        if (repository.existsByFormationIdAndFormateurId(formationId, formateurId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Formateur deja affecte");
        }
        FormationFormateur link = new FormationFormateur();
        link.setFormationId(formationId);
        link.setFormateurId(formateurId);
        link.setRoleDansFormation(roleDansFormation);
        link.setFormateur(formateur);
        FormationFormateur saved = repository.save(link);
        saved.setFormateur(formateur);
        return FormationFormateurDto.from(saved);
    }

    @Transactional
    public void unassign(Long formationId, Long formateurId) {
        if (!repository.existsByFormationIdAndFormateurId(formationId, formateurId)) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "Affectation introuvable");
        }
        repository.deleteById(new com.uchk.gap.formation.entity.FormationFormateurId(
                formationId, formateurId));
    }

    @Transactional(readOnly = true)
    public List<StatGenreDto> statsGenre(Long formationId) {
        formationService.getOrThrow(formationId);
        return etudiantRepository.countByFormationGroupByGenre(formationId).stream()
                .map(row -> new StatGenreDto(
                        row[0] != null ? row[0].toString() : "Non renseigne",
                        ((Number) row[1]).longValue()))
                .toList();
    }
}

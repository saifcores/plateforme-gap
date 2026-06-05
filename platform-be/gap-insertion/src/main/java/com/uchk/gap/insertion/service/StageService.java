package com.uchk.gap.insertion.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.etudiant.entity.Etudiant;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import com.uchk.gap.insertion.dto.StageDto;
import com.uchk.gap.insertion.entity.Partenaire;
import com.uchk.gap.insertion.entity.Stage;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import com.uchk.gap.insertion.repository.StageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StageService {

    private final StageRepository repository;
    private final EtudiantRepository etudiantRepository;
    private final PartenaireRepository partenaireRepository;

    public StageService(StageRepository repository, EtudiantRepository etudiantRepository,
            PartenaireRepository partenaireRepository) {
        this.repository = repository;
        this.etudiantRepository = etudiantRepository;
        this.partenaireRepository = partenaireRepository;
    }

    public List<StageDto> findAll() {
        return repository.findByOrderByDateDebutDesc().stream().map(StageDto::from).toList();
    }

    @Transactional
    public StageDto create(StageDto.Request request) {
        Stage s = new Stage();
        apply(s, request);
        return StageDto.from(repository.save(s));
    }

    public StageDto findById(Long id) {
        return StageDto.from(getOrThrow(id));
    }

    @Transactional
    public StageDto update(Long id, StageDto.Request request) {
        Stage s = getOrThrow(id);
        apply(s, request);
        return StageDto.from(repository.save(s));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Stage getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Stage introuvable"));
    }

    private void apply(Stage s, StageDto.Request r) {
        Etudiant etudiant = etudiantRepository.findById(r.etudiantId())
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Étudiant introuvable"));
        s.setEtudiant(etudiant);
        if (r.partenaireId() != null) {
            Partenaire p = partenaireRepository.findById(r.partenaireId())
                    .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Partenaire introuvable"));
            s.setPartenaire(p);
        } else {
            s.setPartenaire(null);
        }
        s.setSujet(r.sujet());
        s.setDateDebut(r.dateDebut());
        s.setDateFin(r.dateFin());
        s.setBilan(r.bilan());
        s.setNote(r.note());
    }
}

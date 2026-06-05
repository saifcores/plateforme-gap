package com.uchk.gap.insertion.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.etudiant.entity.Etudiant;
import com.uchk.gap.etudiant.repository.EtudiantRepository;
import com.uchk.gap.insertion.dto.InsertionDto;
import com.uchk.gap.insertion.dto.InsertionStatsDto;
import com.uchk.gap.insertion.entity.Insertion;
import com.uchk.gap.insertion.repository.InsertionRepository;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import com.uchk.gap.insertion.repository.RegistreContactRepository;
import com.uchk.gap.insertion.repository.StageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InsertionService {

    private final InsertionRepository repository;
    private final EtudiantRepository etudiantRepository;
    private final StageRepository stageRepository;
    private final RegistreContactRepository registreContactRepository;
    private final PartenaireRepository partenaireRepository;

    public InsertionService(
            InsertionRepository repository,
            EtudiantRepository etudiantRepository,
            StageRepository stageRepository,
            RegistreContactRepository registreContactRepository,
            PartenaireRepository partenaireRepository) {
        this.repository = repository;
        this.etudiantRepository = etudiantRepository;
        this.stageRepository = stageRepository;
        this.registreContactRepository = registreContactRepository;
        this.partenaireRepository = partenaireRepository;
    }

    public List<InsertionDto> findAll() {
        return repository.findByOrderByDateInsertionDesc().stream().map(InsertionDto::from).toList();
    }

    public InsertionDto findMine(String email) {
        Etudiant etudiant = etudiantRepository.findByUtilisateurEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Fiche étudiant introuvable"));
        return repository.findFirstByEtudiantIdOrderByDateInsertionDesc(etudiant.getId())
                .map(InsertionDto::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Aucune insertion enregistrée"));
    }

    @Transactional
    public InsertionDto create(InsertionDto.Request request) {
        Insertion i = new Insertion();
        apply(i, request);
        return InsertionDto.from(repository.save(i));
    }

    public InsertionDto findById(Long id) {
        return InsertionDto.from(getOrThrow(id));
    }

    @Transactional
    public InsertionDto update(Long id, InsertionDto.Request request) {
        Insertion i = getOrThrow(id);
        apply(i, request);
        return InsertionDto.from(repository.save(i));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    public InsertionStatsDto stats() {
        long autoEmploi = repository.countByType("AUTO_EMPLOI");
        long salarie = repository.countByType("SALARIE");
        List<InsertionStatsDto.SecteurStat> parSecteur = repository.countBySecteur().stream()
                .map(row -> new InsertionStatsDto.SecteurStat((String) row[0], (Long) row[1]))
                .toList();
        return new InsertionStatsDto(
                repository.count(),
                autoEmploi,
                salarie,
                stageRepository.count(),
                registreContactRepository.count(),
                partenaireRepository.count(),
                parSecteur);
    }

    private Insertion getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Insertion introuvable"));
    }

    private void apply(Insertion entity, InsertionDto.Request r) {
        Etudiant etudiant = etudiantRepository.findById(r.etudiantId())
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Étudiant introuvable"));
        entity.setEtudiant(etudiant);
        entity.setType(r.type());
        entity.setEntreprise(r.entreprise());
        entity.setPoste(r.poste());
        entity.setSecteur(r.secteur());
        entity.setDateInsertion(r.dateInsertion());
    }
}

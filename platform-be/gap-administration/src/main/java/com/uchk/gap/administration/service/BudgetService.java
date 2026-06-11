package com.uchk.gap.administration.service;

import com.uchk.gap.administration.dto.BudgetDto;
import com.uchk.gap.administration.entity.Budget;
import com.uchk.gap.administration.entity.LigneBudget;
import com.uchk.gap.administration.repository.BudgetRepository;
import com.uchk.gap.common.BusinessException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BudgetService {

    private final BudgetRepository repository;

    public BudgetService(BudgetRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<BudgetDto> findAll() {
        return repository.findByOrderByAnneeDescTypeAsc().stream().map(BudgetDto::summary).toList();
    }

    @Transactional(readOnly = true)
    public BudgetDto findById(Long id) {
        return BudgetDto.detail(getDetailOrThrow(id));
    }

    @Transactional
    public BudgetDto create(BudgetDto.Request request) {
        Budget b = new Budget();
        applyScalars(b, request);
        applyLignes(b, request);
        return BudgetDto.detail(repository.save(b));
    }

    @Transactional
    public BudgetDto update(Long id, BudgetDto.Request request) {
        Budget b = getDetailOrThrow(id);
        applyScalars(b, request);
        b.getLignes().clear();
        applyLignes(b, request);
        return BudgetDto.detail(repository.save(b));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getDetailOrThrow(id));
    }

    private Budget getDetailOrThrow(Long id) {
        return repository.findWithLignesById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Budget introuvable"));
    }

    private void applyScalars(Budget b, BudgetDto.Request r) {
        b.setAnnee(r.annee());
        b.setType(r.type());
        b.setNoteOrientation(r.noteOrientation());
        b.setDocumentUrl(r.documentUrl());
    }

    private void applyLignes(Budget b, BudgetDto.Request r) {
        if (r.lignes() == null) {
            return;
        }
        for (BudgetDto.LigneRequest lr : r.lignes()) {
            LigneBudget ligne = new LigneBudget();
            ligne.setIntitule(lr.intitule());
            if (lr.montantPrevu() != null) {
                ligne.setMontantPrevu(lr.montantPrevu());
            }
            if (lr.montantRealise() != null) {
                ligne.setMontantRealise(lr.montantRealise());
            }
            b.addLigne(ligne);
        }
    }
}

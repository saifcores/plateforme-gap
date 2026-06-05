package com.uchk.gap.formation.dto;

import com.uchk.gap.formation.entity.Formation;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FormationDto(
        Long id,
        String intitule,
        String type,
        String niveau,
        LocalDate dateDebut,
        LocalDate dateFin,
        String typeFinancement,
        BigDecimal montantFinancement,
        String description) {

    public static FormationDto from(Formation f) {
        return new FormationDto(
                f.getId(),
                f.getIntitule(),
                f.getType(),
                f.getNiveau(),
                f.getDateDebut(),
                f.getDateFin(),
                f.getTypeFinancement(),
                f.getMontantFinancement(),
                f.getDescription());
    }
}

package com.uchk.gap.etudiant.dto;

import com.uchk.gap.etudiant.entity.AutreFormation;

public record AutreFormationDto(
        Long id,
        String intitule,
        String organisme,
        Integer annee) {

    public static AutreFormationDto from(AutreFormation a) {
        return new AutreFormationDto(a.getId(), a.getIntitule(), a.getOrganisme(), a.getAnnee());
    }
}

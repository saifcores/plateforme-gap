package com.uchk.gap.etudiant.dto;

import com.uchk.gap.etudiant.entity.Diplome;

public record DiplomeDto(
        Long id,
        String intitule,
        String type,
        String etablissement,
        Integer annee) {

    public static DiplomeDto from(Diplome d) {
        return new DiplomeDto(d.getId(), d.getIntitule(), d.getType(), d.getEtablissement(), d.getAnnee());
    }
}

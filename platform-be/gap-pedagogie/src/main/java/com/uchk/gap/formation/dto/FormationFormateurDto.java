package com.uchk.gap.formation.dto;

import com.uchk.gap.formation.entity.FormationFormateur;

public record FormationFormateurDto(
                Long formationId,
                Long formateurId,
                String formateurNom,
                String roleDansFormation) {

        public static FormationFormateurDto from(FormationFormateur link) {
                String nom = link.getFormateur() != null
                                ? link.getFormateur().getPrenom() + " " + link.getFormateur().getNom()
                                : null;
                return new FormationFormateurDto(
                                link.getFormationId(),
                                link.getFormateurId(),
                                nom,
                                link.getRoleDansFormation());
        }
}

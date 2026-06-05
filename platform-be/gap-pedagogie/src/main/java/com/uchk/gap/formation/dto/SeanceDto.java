package com.uchk.gap.formation.dto;

import com.uchk.gap.formation.entity.Seance;
import java.time.LocalDate;
import java.time.LocalTime;

public record SeanceDto(
                Long id,
                Long formationId,
                Long formateurId,
                String formateurNom,
                String matiere,
                String type,
                LocalDate dateSeance,
                LocalTime heureDebut,
                LocalTime heureFin,
                String salle) {

        public static SeanceDto from(Seance s) {
                Long formateurId = s.getFormateur() != null ? s.getFormateur().getId() : null;
                String formateurNom = s.getFormateur() != null
                                ? s.getFormateur().getPrenom() + " " + s.getFormateur().getNom()
                                : null;
                return new SeanceDto(
                                s.getId(),
                                s.getFormation().getId(),
                                formateurId,
                                formateurNom,
                                s.getMatiere(),
                                s.getType(),
                                s.getDateSeance(),
                                s.getHeureDebut(),
                                s.getHeureFin(),
                                s.getSalle());
        }
}

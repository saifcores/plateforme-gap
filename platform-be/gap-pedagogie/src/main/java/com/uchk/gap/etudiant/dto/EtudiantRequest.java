package com.uchk.gap.etudiant.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public record EtudiantRequest(
                @NotBlank String ine,
                @NotBlank String nom,
                @NotBlank String prenom,
                LocalDate dateNaissance,
                String genre,
                String email,
                String telephone,
                Long formationId,
                String promo,
                Integer anneeDebut,
                Integer anneeSortie,
                @Valid List<DiplomeRequest> diplomes,
                @Valid List<AutreFormationRequest> autresFormations) {

        public record DiplomeRequest(
                        @NotBlank String intitule,
                        String type,
                        String etablissement,
                        Integer annee) {
        }

        public record AutreFormationRequest(
                        @NotBlank String intitule,
                        String organisme,
                        Integer annee) {
        }
}

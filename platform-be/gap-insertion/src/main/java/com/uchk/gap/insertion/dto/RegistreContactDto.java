package com.uchk.gap.insertion.dto;

import com.uchk.gap.insertion.entity.RegistreContact;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record RegistreContactDto(
                Long id,
                Long etudiantId,
                String etudiantNom,
                LocalDate dateContact,
                String canal,
                String objet,
                String compteRendu) {

        public static RegistreContactDto from(RegistreContact r) {
                String etu = r.getEtudiant() != null
                                ? r.getEtudiant().getPrenom() + " " + r.getEtudiant().getNom()
                                : null;
                return new RegistreContactDto(
                                r.getId(),
                                r.getEtudiant() != null ? r.getEtudiant().getId() : null,
                                etu, r.getDateContact(), r.getCanal(), r.getObjet(), r.getCompteRendu());
        }

        public record Request(
                        @NotNull Long etudiantId,
                        @NotNull LocalDate dateContact,
                        String canal,
                        String objet,
                        String compteRendu) {
        }
}

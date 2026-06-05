package com.uchk.gap.communication.dto;

import com.uchk.gap.communication.entity.CompteRendu;
import com.uchk.gap.utilisateur.entity.Role;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public record CompteRenduDto(
                Long id,
                String titre,
                String type,
                LocalDate dateEvent,
                String contenu,
                String documentUrl,
                String auteur,
                Set<String> rolesAutorises) {

        public static CompteRenduDto from(CompteRendu c) {
                String auteur = c.getAuteur() != null
                                ? c.getAuteur().getPrenom() + " " + c.getAuteur().getNom()
                                : null;
                return new CompteRenduDto(
                                c.getId(),
                                c.getTitre(),
                                c.getType(),
                                c.getDateEvent(),
                                c.getContenu(),
                                c.getDocumentUrl(),
                                auteur,
                                c.getRolesAutorises().stream().map(Role::getCode).collect(Collectors.toSet()));
        }
}

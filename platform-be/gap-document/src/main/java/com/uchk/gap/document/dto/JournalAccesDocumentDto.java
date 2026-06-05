package com.uchk.gap.document.dto;

import com.uchk.gap.document.entity.JournalAccesDocument;
import java.time.OffsetDateTime;

public record JournalAccesDocumentDto(
        Long id,
        Long documentId,
        String documentNom,
        String utilisateurEmail,
        String utilisateurNom,
        String action,
        OffsetDateTime accedeLe) {

    public static JournalAccesDocumentDto from(JournalAccesDocument entry) {
        String email = entry.getEmail();
        String nom = null;
        if (entry.getUtilisateur() != null) {
            email = entry.getUtilisateur().getEmail();
            nom = entry.getUtilisateur().getPrenom() + " " + entry.getUtilisateur().getNom();
        }
        return new JournalAccesDocumentDto(
                entry.getId(),
                entry.getDocument().getId(),
                entry.getDocument().getNom(),
                email,
                nom,
                entry.getAction(),
                entry.getAccedeLe());
    }
}

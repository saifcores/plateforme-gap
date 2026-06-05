package com.uchk.gap.document.dto;

import com.uchk.gap.document.entity.Document;
import java.time.OffsetDateTime;

public record DocumentDto(
        Long id,
        String nom,
        String typeMime,
        String url,
        Long taille,
        String module,
        Long entiteId,
        OffsetDateTime createdAt) {

    public static DocumentDto from(Document document) {
        return new DocumentDto(
                document.getId(),
                document.getNom(),
                document.getTypeMime(),
                document.getUrl(),
                document.getTaille(),
                document.getModule(),
                document.getEntiteId(),
                document.getCreatedAt());
    }
}

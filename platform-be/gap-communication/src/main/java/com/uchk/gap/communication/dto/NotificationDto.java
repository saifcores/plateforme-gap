package com.uchk.gap.communication.dto;

import com.uchk.gap.communication.entity.Notification;
import java.time.OffsetDateTime;

public record NotificationDto(
        Long id,
        String titre,
        String message,
        String type,
        String lien,
        boolean lu,
        OffsetDateTime createdAt) {

    public static NotificationDto from(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getTitre(),
                n.getMessage(),
                n.getType(),
                n.getLien(),
                n.isLu(),
                n.getCreatedAt());
    }
}

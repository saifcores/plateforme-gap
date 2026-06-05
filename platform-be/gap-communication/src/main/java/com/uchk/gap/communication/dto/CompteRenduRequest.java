package com.uchk.gap.communication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;

public record CompteRenduRequest(
                @NotBlank String titre,
                @NotBlank String type,
                @NotNull LocalDate dateEvent,
                String contenu,
                String documentUrl,
                Set<String> rolesAutorises) {
}

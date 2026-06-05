package com.uchk.gap.utilisateur.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record UpdateUtilisateurRequest(
                @NotBlank String nom,
                @NotBlank String prenom,
                String telephone,
                boolean actif,
                Set<String> roles,
                String motDePasse) {
}

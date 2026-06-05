package com.uchk.gap.utilisateur.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record RegisterRequest(
                @NotBlank @Email String email,
                @NotBlank @Size(min = 6) String motDePasse,
                @NotBlank String nom,
                @NotBlank String prenom,
                String telephone,
                @NotEmpty Set<String> roles) {
}

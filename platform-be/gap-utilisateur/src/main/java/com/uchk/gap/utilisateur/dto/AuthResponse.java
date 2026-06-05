package com.uchk.gap.utilisateur.dto;

public record AuthResponse(
        String token,
        String type,
        UtilisateurDto utilisateur) {

    public static AuthResponse bearer(String token, UtilisateurDto utilisateur) {
        return new AuthResponse(token, "Bearer", utilisateur);
    }
}

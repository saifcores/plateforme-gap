package com.uchk.gap.utilisateur.dto;

import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import java.util.Set;
import java.util.stream.Collectors;

public record UtilisateurDto(
        Long id,
        String email,
        String nom,
        String prenom,
        String telephone,
        String photoUrl,
        boolean actif,
        Set<String> roles) {

    public static UtilisateurDto from(Utilisateur u) {
        return new UtilisateurDto(
                u.getId(),
                u.getEmail(),
                u.getNom(),
                u.getPrenom(),
                u.getTelephone(),
                u.getPhotoUrl(),
                u.isActif(),
                u.getRoles().stream().map(Role::getCode).collect(Collectors.toSet()));
    }
}

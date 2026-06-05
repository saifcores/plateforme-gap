package com.uchk.gap.formation.dto;

import com.uchk.gap.formation.entity.Formateur;

public record FormateurDto(
        Long id,
        String nom,
        String prenom,
        String email,
        String type,
        String specialite,
        String grade) {

    public static FormateurDto from(Formateur f) {
        return new FormateurDto(
                f.getId(),
                f.getNom(),
                f.getPrenom(),
                f.getEmail(),
                f.getType(),
                f.getSpecialite(),
                f.getGrade());
    }
}

package com.uchk.gap.utilisateur.dto;

import com.uchk.gap.utilisateur.entity.Role;

public record RoleDto(Long id, String code, String libelle) {

    public static RoleDto from(Role role) {
        return new RoleDto(role.getId(), role.getCode(), role.getLibelle());
    }
}

package com.uchk.gap.utilisateur.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.common.PageResponse;
import com.uchk.gap.utilisateur.dto.RegisterRequest;
import com.uchk.gap.utilisateur.dto.UpdateUtilisateurRequest;
import com.uchk.gap.utilisateur.dto.UtilisateurDto;
import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.RoleRepository;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(
            UtilisateurRepository repository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UtilisateurDto> findAll() {
        return repository.findAll().stream().map(UtilisateurDto::from).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<UtilisateurDto> search(String q, Pageable pageable) {
        return PageResponse.from(
                repository.search(q, pageable).map(UtilisateurDto::from));
    }

    public UtilisateurDto findById(Long id) {
        return UtilisateurDto.from(getOrThrow(id));
    }

    @Transactional
    public UtilisateurDto create(RegisterRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Email deja utilise");
        }
        Utilisateur user = new Utilisateur();
        user.setEmail(request.email());
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        user.setNom(request.nom());
        user.setPrenom(request.prenom());
        user.setTelephone(request.telephone());
        user.setRoles(resolveRoles(request.roles()));
        return UtilisateurDto.from(repository.save(user));
    }

    @Transactional
    public UtilisateurDto update(Long id, UpdateUtilisateurRequest request) {
        Utilisateur user = getOrThrow(id);
        user.setNom(request.nom());
        user.setPrenom(request.prenom());
        user.setTelephone(request.telephone());
        user.setActif(request.actif());
        if (request.roles() != null && !request.roles().isEmpty()) {
            user.setRoles(resolveRoles(request.roles()));
        }
        if (request.motDePasse() != null && !request.motDePasse().isBlank()) {
            user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        }
        return UtilisateurDto.from(repository.save(user));
    }

    private Utilisateur getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    private Set<Role> resolveRoles(Set<String> codes) {
        Set<Role> roles = new HashSet<>();
        for (String code : codes) {
            Role role = roleRepository.findByCode(code)
                    .orElseThrow(() -> new BusinessException(
                            HttpStatus.BAD_REQUEST, "Role inconnu: " + code));
            roles.add(role);
        }
        return roles;
    }
}

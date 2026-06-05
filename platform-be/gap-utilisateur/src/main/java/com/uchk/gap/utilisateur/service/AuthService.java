package com.uchk.gap.utilisateur.service;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.security.JwtService;
import com.uchk.gap.utilisateur.dto.AuthResponse;
import com.uchk.gap.utilisateur.dto.LoginRequest;
import com.uchk.gap.utilisateur.dto.RegisterRequest;
import com.uchk.gap.utilisateur.dto.UtilisateurDto;
import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.RoleRepository;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.util.HashSet;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
            JwtService jwtService,
            UtilisateurRepository utilisateurRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        UserDetails principal = (UserDetails) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.motDePasse()))
                .getPrincipal();
        Utilisateur user = utilisateurRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));
        String token = jwtService.generateToken(principal);
        return AuthResponse.bearer(token, UtilisateurDto.from(user));
    }

    @Transactional
    public UtilisateurDto register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.email())) {
            throw new BusinessException(HttpStatus.CONFLICT, "Email deja utilise");
        }
        Set<Role> roles = new HashSet<>();
        for (String code : request.roles()) {
            Role role = roleRepository.findByCode(code)
                    .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "Role inconnu: " + code));
            roles.add(role);
        }
        Utilisateur user = new Utilisateur();
        user.setEmail(request.email());
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        user.setNom(request.nom());
        user.setPrenom(request.prenom());
        user.setTelephone(request.telephone());
        user.setRoles(roles);
        return UtilisateurDto.from(utilisateurRepository.save(user));
    }

    public UtilisateurDto currentUser(String email) {
        return utilisateurRepository.findByEmail(email)
                .map(UtilisateurDto::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }
}

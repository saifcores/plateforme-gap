package com.uchk.gap.utilisateur.config;

import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import com.uchk.gap.utilisateur.repository.RoleRepository;
import com.uchk.gap.utilisateur.repository.UtilisateurRepository;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedAdmin(UtilisateurRepository utilisateurRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@uchk.sn";
            if (utilisateurRepository.existsByEmail(adminEmail)) {
                return;
            }
            Role adminRole = roleRepository.findByCode("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("Role ADMIN absent (verifier Flyway V2)"));

            Utilisateur admin = new Utilisateur();
            admin.setEmail(adminEmail);
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setNom("Administrateur");
            admin.setPrenom("UCHK");
            admin.setRoles(Set.of(adminRole));
            utilisateurRepository.save(admin);

            log.info("Compte admin cree : {} / admin123", adminEmail);
        };
    }
}

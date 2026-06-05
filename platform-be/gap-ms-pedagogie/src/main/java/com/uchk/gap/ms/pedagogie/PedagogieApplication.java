package com.uchk.gap.ms.pedagogie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
                "com.uchk.gap.formation",
                "com.uchk.gap.etudiant",
                "com.uchk.gap.utilisateur",
                "com.uchk.gap.security",
                "com.uchk.gap.common",
})
@EntityScan({
                "com.uchk.gap.formation.entity",
                "com.uchk.gap.etudiant.entity",
                "com.uchk.gap.utilisateur.entity",
})
@EnableJpaRepositories({
                "com.uchk.gap.formation.repository",
                "com.uchk.gap.etudiant.repository",
                "com.uchk.gap.utilisateur.repository",
})
public class PedagogieApplication {

        public static void main(String[] args) {
                SpringApplication.run(PedagogieApplication.class, args);
        }
}

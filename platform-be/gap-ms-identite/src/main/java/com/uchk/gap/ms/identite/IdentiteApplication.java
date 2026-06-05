package com.uchk.gap.ms.identite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
        "com.uchk.gap.utilisateur",
        "com.uchk.gap.security",
        "com.uchk.gap.common",
        "com.uchk.gap.ms.identite",
})
@EntityScan("com.uchk.gap.utilisateur.entity")
@EnableJpaRepositories("com.uchk.gap.utilisateur.repository")
public class IdentiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(IdentiteApplication.class, args);
    }
}

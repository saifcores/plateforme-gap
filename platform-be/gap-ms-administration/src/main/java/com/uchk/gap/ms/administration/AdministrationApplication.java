package com.uchk.gap.ms.administration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
                "com.uchk.gap.administration",
                "com.uchk.gap.communication",
                "com.uchk.gap.utilisateur",
                "com.uchk.gap.security",
                "com.uchk.gap.common",
})
@EntityScan({
                "com.uchk.gap.administration.entity",
                "com.uchk.gap.communication.entity",
                "com.uchk.gap.utilisateur.entity",
})
@EnableJpaRepositories({
                "com.uchk.gap.administration.repository",
                "com.uchk.gap.communication.repository",
                "com.uchk.gap.utilisateur.repository",
})
public class AdministrationApplication {

        public static void main(String[] args) {
                SpringApplication.run(AdministrationApplication.class, args);
        }
}

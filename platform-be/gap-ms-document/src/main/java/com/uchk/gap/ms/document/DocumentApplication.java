package com.uchk.gap.ms.document;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
                "com.uchk.gap.document",
                "com.uchk.gap.utilisateur",
                "com.uchk.gap.security",
                "com.uchk.gap.common",
})
@EntityScan({
                "com.uchk.gap.document.entity",
                "com.uchk.gap.utilisateur.entity",
})
@EnableJpaRepositories({
                "com.uchk.gap.document.repository",
                "com.uchk.gap.utilisateur.repository",
})
public class DocumentApplication {

        public static void main(String[] args) {
                SpringApplication.run(DocumentApplication.class, args);
        }
}

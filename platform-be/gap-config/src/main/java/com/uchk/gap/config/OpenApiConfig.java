package com.uchk.gap.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

        private static final String SCHEME = "bearerAuth";

        @Bean
        public OpenAPI gapOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("API - Gestion administrative et pedagogique (UCHK)")
                                                .description("API REST de l'application de gestion de l'Universite Cheikh Hamidou Kane")
                                                .version("v1.0.0"))
                                .addSecurityItem(new SecurityRequirement().addList(SCHEME))
                                .components(new Components().addSecuritySchemes(SCHEME,
                                                new SecurityScheme()
                                                                .type(SecurityScheme.Type.HTTP)
                                                                .scheme("bearer")
                                                                .bearerFormat("JWT")));
        }
}

package com.uchk.gap.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "0123456789012345678901234567890123456789012345678901234567890",
                3600000L);
    }

    @Test
    void generateToken_etValidation() {
        User user = new User(
                "admin@uchk.sn",
                "secret",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

        String token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin@uchk.sn");
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }
}

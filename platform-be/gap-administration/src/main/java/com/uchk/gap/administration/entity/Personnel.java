package com.uchk.gap.administration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "personnel")
@Getter
@Setter
@NoArgsConstructor
public class Personnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String nom;

    @Column(length = 100)
    private String prenom;

    @Column(length = 150)
    private String email;

    @Column(unique = true, length = 60)
    private String matricule;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(length = 150)
    private String fonction;

    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

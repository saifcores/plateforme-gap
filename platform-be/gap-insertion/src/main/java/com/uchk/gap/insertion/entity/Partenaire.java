package com.uchk.gap.insertion.entity;

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
@Table(name = "partenaire")
@Getter
@Setter
@NoArgsConstructor
public class Partenaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(length = 60)
    private String type;

    @Column(length = 120)
    private String secteur;

    @Column(name = "contact_nom", length = 120)
    private String contactNom;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(length = 30)
    private String telephone;

    @Column(length = 200)
    private String adresse;

    @Column(name = "date_partenariat")
    private LocalDate datePartenariat;

    @Column(length = 40)
    private String statut = "ACTIF";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

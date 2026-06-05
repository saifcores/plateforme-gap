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
@Table(name = "courrier")
@Getter
@Setter
@NoArgsConstructor
public class Courrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String type;

    @Column(length = 80)
    private String reference;

    @Column(nullable = false, length = 200)
    private String objet;

    @Column(length = 150)
    private String expediteur;

    @Column(length = 150)
    private String destinataire;

    @Column(name = "date_courrier", nullable = false)
    private LocalDate dateCourrier;

    @Column(name = "document_url", length = 255)
    private String documentUrl;

    @Column(length = 40)
    private String statut = "RECU";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

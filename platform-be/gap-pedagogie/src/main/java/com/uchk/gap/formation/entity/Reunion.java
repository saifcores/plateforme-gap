package com.uchk.gap.formation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reunion")
@Getter
@Setter
@NoArgsConstructor
public class Reunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id")
    private Formation formation;

    @Column(nullable = false, length = 40)
    private String type;

    @Column(nullable = false, length = 200)
    private String objet;

    @Column(name = "date_reunion", nullable = false)
    private OffsetDateTime dateReunion;

    @Column(length = 120)
    private String lieu;

    @Column(name = "compte_rendu", columnDefinition = "text")
    private String compteRendu;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

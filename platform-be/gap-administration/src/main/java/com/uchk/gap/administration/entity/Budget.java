package com.uchk.gap.administration.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "budget")
@Getter
@Setter
@NoArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer annee;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "note_orientation", columnDefinition = "text")
    private String noteOrientation;

    @Column(name = "document_url", length = 255)
    private String documentUrl;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneBudget> lignes = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    public void addLigne(LigneBudget ligne) {
        ligne.setBudget(this);
        this.lignes.add(ligne);
    }

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

package com.uchk.gap.communication.entity;

import com.uchk.gap.utilisateur.entity.Role;
import com.uchk.gap.utilisateur.entity.Utilisateur;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "compte_rendu")
@Getter
@Setter
@NoArgsConstructor
public class CompteRendu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(nullable = false, length = 40)
    private String type;

    @Column(name = "date_event", nullable = false)
    private LocalDate dateEvent;

    @Column(columnDefinition = "text")
    private String contenu;

    @Column(name = "document_url", length = 255)
    private String documentUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id")
    private Utilisateur auteur;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "compte_rendu_role", joinColumns = @JoinColumn(name = "compte_rendu_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> rolesAutorises = new HashSet<>();

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

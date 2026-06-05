package com.uchk.gap.document.entity;

import com.uchk.gap.utilisateur.entity.Utilisateur;
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
@Table(name = "journal_acces_document")
@Getter
@Setter
@NoArgsConstructor
public class JournalAccesDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String action = "DOWNLOAD";

    @Column(name = "accede_le", nullable = false)
    private OffsetDateTime accedeLe;

    @PrePersist
    void onCreate() {
        this.accedeLe = OffsetDateTime.now();
    }
}

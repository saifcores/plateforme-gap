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
@Table(name = "note_service")
@Getter
@Setter
@NoArgsConstructor
public class NoteService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String type;

    @Column(length = 80)
    private String reference;

    @Column(nullable = false, length = 200)
    private String objet;

    @Column(columnDefinition = "text")
    private String contenu;

    @Column(name = "document_url", length = 255)
    private String documentUrl;

    @Column(name = "date_note", nullable = false)
    private LocalDate dateNote;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

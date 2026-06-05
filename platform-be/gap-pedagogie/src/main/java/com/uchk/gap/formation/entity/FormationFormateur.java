package com.uchk.gap.formation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "formation_formateur")
@IdClass(FormationFormateurId.class)
@Getter
@Setter
@NoArgsConstructor
public class FormationFormateur {

    @Id
    @Column(name = "formation_id")
    private Long formationId;

    @Id
    @Column(name = "formateur_id")
    private Long formateurId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id", insertable = false, updatable = false)
    private Formation formation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formateur_id", insertable = false, updatable = false)
    private Formateur formateur;

    @Column(name = "role_dans_formation", length = 60)
    private String roleDansFormation;
}

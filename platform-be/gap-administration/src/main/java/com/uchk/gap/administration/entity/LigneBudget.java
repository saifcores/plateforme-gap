package com.uchk.gap.administration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ligne_budget")
@Getter
@Setter
@NoArgsConstructor
public class LigneBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(nullable = false, length = 200)
    private String intitule;

    @Column(name = "montant_prevu")
    private BigDecimal montantPrevu = BigDecimal.ZERO;

    @Column(name = "montant_realise")
    private BigDecimal montantRealise = BigDecimal.ZERO;
}

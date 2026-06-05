package com.uchk.gap.insertion.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.uchk.gap.common.BusinessException;
import com.uchk.gap.insertion.dto.PartenaireDto;
import com.uchk.gap.insertion.entity.Partenaire;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PartenaireServiceTest {

    @Mock
    private PartenaireRepository repository;

    @InjectMocks
    private PartenaireService service;

    @Test
    void create_enregistreUnPartenaire() {
        when(repository.save(any(Partenaire.class))).thenAnswer(inv -> {
            Partenaire p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });

        PartenaireDto result = service.create(new PartenaireDto.Request(
                "Sonatel", "ENTREPRISE", "Télécoms",
                "M. Diallo", "contact@sonatel.sn", "338000000",
                "Dakar", null, "ACTIF"));

        assertThat(result.nom()).isEqualTo("Sonatel");
        assertThat(result.type()).isEqualTo("ENTREPRISE");

        ArgumentCaptor<Partenaire> captor = ArgumentCaptor.forClass(Partenaire.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getNom()).isEqualTo("Sonatel");
    }

    @Test
    void update_leveUneExceptionSiIntrouvable() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, new PartenaireDto.Request(
                "X", null, null, null, null, null, null, null, null)))
                .isInstanceOf(BusinessException.class);
    }
}

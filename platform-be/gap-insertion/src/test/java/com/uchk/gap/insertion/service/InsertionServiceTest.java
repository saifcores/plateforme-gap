package com.uchk.gap.insertion.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.uchk.gap.insertion.dto.InsertionStatsDto;
import com.uchk.gap.insertion.repository.InsertionRepository;
import com.uchk.gap.insertion.repository.PartenaireRepository;
import com.uchk.gap.insertion.repository.RegistreContactRepository;
import com.uchk.gap.insertion.repository.StageRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InsertionServiceTest {

    @Mock
    private InsertionRepository insertionRepository;
    @Mock
    private com.uchk.gap.etudiant.repository.EtudiantRepository etudiantRepository;
    @Mock
    private StageRepository stageRepository;
    @Mock
    private RegistreContactRepository registreContactRepository;
    @Mock
    private PartenaireRepository partenaireRepository;

    @InjectMocks
    private InsertionService service;

    @Test
    void stats_agregeLesIndicateurs() {
        when(insertionRepository.count()).thenReturn(5L);
        when(insertionRepository.countByType("AUTO_EMPLOI")).thenReturn(2L);
        when(insertionRepository.countByType("SALARIE")).thenReturn(3L);
        when(insertionRepository.countBySecteur()).thenReturn(List.of(
                new Object[] { "Télécoms", 2L },
                new Object[] { "Services numériques", 1L }));
        when(stageRepository.count()).thenReturn(4L);
        when(registreContactRepository.count()).thenReturn(7L);
        when(partenaireRepository.count()).thenReturn(3L);

        InsertionStatsDto stats = service.stats();

        assertThat(stats.totalInsertions()).isEqualTo(5);
        assertThat(stats.autoEmploi()).isEqualTo(2);
        assertThat(stats.salarie()).isEqualTo(3);
        assertThat(stats.totalStages()).isEqualTo(4);
        assertThat(stats.totalContacts()).isEqualTo(7);
        assertThat(stats.totalPartenaires()).isEqualTo(3);
        assertThat(stats.parSecteur()).hasSize(2);
    }
}

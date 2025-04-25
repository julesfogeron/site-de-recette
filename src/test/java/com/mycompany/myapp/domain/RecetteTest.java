package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.RecetteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RecetteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Recette.class);
        Recette recette1 = getRecetteSample1();
        Recette recette2 = new Recette();
        assertThat(recette1).isNotEqualTo(recette2);

        recette2.setId(recette1.getId());
        assertThat(recette1).isEqualTo(recette2);

        recette2 = getRecetteSample2();
        assertThat(recette1).isNotEqualTo(recette2);
    }
}

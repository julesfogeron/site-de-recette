package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.RecetteAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Recette;
import com.mycompany.myapp.repository.RecetteRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RecetteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RecetteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENU = "AAAAAAAAAA";
    private static final String UPDATED_CONTENU = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/recettes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RecetteRepository recetteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRecetteMockMvc;

    private Recette recette;

    private Recette insertedRecette;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recette createEntity() {
        return new Recette().nom(DEFAULT_NOM).description(DEFAULT_DESCRIPTION).contenu(DEFAULT_CONTENU);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recette createUpdatedEntity() {
        return new Recette().nom(UPDATED_NOM).description(UPDATED_DESCRIPTION).contenu(UPDATED_CONTENU);
    }

    @BeforeEach
    void initTest() {
        recette = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedRecette != null) {
            recetteRepository.delete(insertedRecette);
            insertedRecette = null;
        }
    }

    @Test
    @Transactional
    void createRecette() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Recette
        var returnedRecette = om.readValue(
            restRecetteMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recette)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Recette.class
        );

        // Validate the Recette in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRecetteUpdatableFieldsEquals(returnedRecette, getPersistedRecette(returnedRecette));

        insertedRecette = returnedRecette;
    }

    @Test
    @Transactional
    void createRecetteWithExistingId() throws Exception {
        // Create the Recette with an existing ID
        recette.setId(1);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRecetteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recette)))
            .andExpect(status().isBadRequest());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRecettes() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        // Get all the recetteList
        restRecetteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recette.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].contenu").value(hasItem(DEFAULT_CONTENU)));
    }

    @Test
    @Transactional
    void getRecette() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        // Get the recette
        restRecetteMockMvc
            .perform(get(ENTITY_API_URL_ID, recette.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(recette.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.contenu").value(DEFAULT_CONTENU));
    }

    @Test
    @Transactional
    void getNonExistingRecette() throws Exception {
        // Get the recette
        restRecetteMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRecette() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recette
        Recette updatedRecette = recetteRepository.findById(recette.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRecette are not directly saved in db
        em.detach(updatedRecette);
        updatedRecette.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION).contenu(UPDATED_CONTENU);

        restRecetteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRecette.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRecette))
            )
            .andExpect(status().isOk());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRecetteToMatchAllProperties(updatedRecette);
    }

    @Test
    @Transactional
    void putNonExistingRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(put(ENTITY_API_URL_ID, recette.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recette)))
            .andExpect(status().isBadRequest());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(recette))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(recette)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRecetteWithPatch() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recette using partial update
        Recette partialUpdatedRecette = new Recette();
        partialUpdatedRecette.setId(recette.getId());

        partialUpdatedRecette.nom(UPDATED_NOM).contenu(UPDATED_CONTENU);

        restRecetteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecette.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRecette))
            )
            .andExpect(status().isOk());

        // Validate the Recette in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRecetteUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedRecette, recette), getPersistedRecette(recette));
    }

    @Test
    @Transactional
    void fullUpdateRecetteWithPatch() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the recette using partial update
        Recette partialUpdatedRecette = new Recette();
        partialUpdatedRecette.setId(recette.getId());

        partialUpdatedRecette.nom(UPDATED_NOM).description(UPDATED_DESCRIPTION).contenu(UPDATED_CONTENU);

        restRecetteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRecette.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRecette))
            )
            .andExpect(status().isOk());

        // Validate the Recette in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRecetteUpdatableFieldsEquals(partialUpdatedRecette, getPersistedRecette(partialUpdatedRecette));
    }

    @Test
    @Transactional
    void patchNonExistingRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, recette.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(recette))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(recette))
            )
            .andExpect(status().isBadRequest());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRecette() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        recette.setId(intCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRecetteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(recette)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Recette in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRecette() throws Exception {
        // Initialize the database
        insertedRecette = recetteRepository.saveAndFlush(recette);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the recette
        restRecetteMockMvc
            .perform(delete(ENTITY_API_URL_ID, recette.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return recetteRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Recette getPersistedRecette(Recette recette) {
        return recetteRepository.findById(recette.getId()).orElseThrow();
    }

    protected void assertPersistedRecetteToMatchAllProperties(Recette expectedRecette) {
        assertRecetteAllPropertiesEquals(expectedRecette, getPersistedRecette(expectedRecette));
    }

    protected void assertPersistedRecetteToMatchUpdatableProperties(Recette expectedRecette) {
        assertRecetteAllUpdatablePropertiesEquals(expectedRecette, getPersistedRecette(expectedRecette));
    }
}

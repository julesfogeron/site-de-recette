package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Recette;
import com.mycompany.myapp.repository.RecetteRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Recette}.
 */
@RestController
@RequestMapping("/api/recettes")
@Transactional
public class RecetteResource {

    private static final Logger LOG = LoggerFactory.getLogger(RecetteResource.class);

    private static final String ENTITY_NAME = "recette";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RecetteRepository recetteRepository;

    public RecetteResource(RecetteRepository recetteRepository) {
        this.recetteRepository = recetteRepository;
    }

    /**
     * {@code POST  /recettes} : Create a new recette.
     *
     * @param recette the recette to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new recette, or with status {@code 400 (Bad Request)} if the recette has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Recette> createRecette(@RequestBody Recette recette) throws URISyntaxException {
        LOG.debug("REST request to save Recette : {}", recette);
        if (recette.getId() != null) {
            throw new BadRequestAlertException("A new recette cannot already have an ID", ENTITY_NAME, "idexists");
        }
        recette = recetteRepository.save(recette);
        return ResponseEntity.created(new URI("/api/recettes/" + recette.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, recette.getId().toString()))
            .body(recette);
    }

    /**
     * {@code PUT  /recettes/:id} : Updates an existing recette.
     *
     * @param id the id of the recette to save.
     * @param recette the recette to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated recette,
     * or with status {@code 400 (Bad Request)} if the recette is not valid,
     * or with status {@code 500 (Internal Server Error)} if the recette couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Recette> updateRecette(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Recette recette
    ) throws URISyntaxException {
        LOG.debug("REST request to update Recette : {}, {}", id, recette);
        if (recette.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recette.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recetteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        recette = recetteRepository.save(recette);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, recette.getId().toString()))
            .body(recette);
    }

    /**
     * {@code PATCH  /recettes/:id} : Partial updates given fields of an existing recette, field will ignore if it is null
     *
     * @param id the id of the recette to save.
     * @param recette the recette to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated recette,
     * or with status {@code 400 (Bad Request)} if the recette is not valid,
     * or with status {@code 404 (Not Found)} if the recette is not found,
     * or with status {@code 500 (Internal Server Error)} if the recette couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Recette> partialUpdateRecette(
        @PathVariable(value = "id", required = false) final Integer id,
        @RequestBody Recette recette
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Recette partially : {}, {}", id, recette);
        if (recette.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recette.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recetteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Recette> result = recetteRepository
            .findById(recette.getId())
            .map(existingRecette -> {
                if (recette.getNom() != null) {
                    existingRecette.setNom(recette.getNom());
                }
                if (recette.getDescription() != null) {
                    existingRecette.setDescription(recette.getDescription());
                }
                if (recette.getContenu() != null) {
                    existingRecette.setContenu(recette.getContenu());
                }

                return existingRecette;
            })
            .map(recetteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, recette.getId().toString())
        );
    }

    /**
     * {@code GET  /recettes} : get all the recettes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of recettes in body.
     */
    @GetMapping("")
    public List<Recette> getAllRecettes() {
        LOG.debug("REST request to get all Recettes");
        return recetteRepository.findAll();
    }

    /**
     * {@code GET  /recettes/:id} : get the "id" recette.
     *
     * @param id the id of the recette to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the recette, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Recette> getRecette(@PathVariable("id") Integer id) {
        LOG.debug("REST request to get Recette : {}", id);
        Optional<Recette> recette = recetteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(recette);
    }

    /**
     * {@code DELETE  /recettes/:id} : delete the "id" recette.
     *
     * @param id the id of the recette to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecette(@PathVariable("id") Integer id) {
        LOG.debug("REST request to delete Recette : {}", id);
        recetteRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

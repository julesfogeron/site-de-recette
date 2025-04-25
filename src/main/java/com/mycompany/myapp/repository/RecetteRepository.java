package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Recette;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Recette entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecetteRepository extends JpaRepository<Recette, Integer> {}

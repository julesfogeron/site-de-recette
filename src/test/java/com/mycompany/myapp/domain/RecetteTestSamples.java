package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class RecetteTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Recette getRecetteSample1() {
        return new Recette().id(1).nom("nom1").description("description1").contenu("contenu1");
    }

    public static Recette getRecetteSample2() {
        return new Recette().id(2).nom("nom2").description("description2").contenu("contenu2");
    }

    public static Recette getRecetteRandomSampleGenerator() {
        return new Recette()
            .id(intCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .contenu(UUID.randomUUID().toString());
    }
}

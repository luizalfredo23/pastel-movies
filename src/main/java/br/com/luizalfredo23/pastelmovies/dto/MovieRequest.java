package br.com.luizalfredo23.pastelmovies.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Set;

public record MovieRequest(
        @NotBlank String title,
        @NotNull @Positive Integer year,
        @NotNull @Positive Integer duration,
        String synopsis,
        Set<Long> genreIds,
        Set<Long> actorIds
) {
}

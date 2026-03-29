package br.com.luizalfredo23.pastelmovies.dto;

import java.util.List;

public record MovieResponse(
        Long id,
        String title,
        Integer year,
        Integer duration,
        String synopsis,
        List<NamedIdResponse> genres,
        List<NamedIdResponse> actors,
        List<ReviewResponse> reviews
) {
}

package br.com.luizalfredo23.pastelmovies.dto;

public record ReviewResponse(
        Long id,
        Integer rating,
        String comment,
        Long movieId,
        String movieTitle,
        Long userId,
        String userName
) {
}

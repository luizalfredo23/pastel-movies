package br.com.luizalfredo23.pastelmovies.dto;

import jakarta.validation.constraints.NotBlank;

public record ActorRequest(@NotBlank String name) {
}

package br.com.luizalfredo23.pastelmovies.service;

import br.com.luizalfredo23.pastelmovies.dto.MovieRequest;
import br.com.luizalfredo23.pastelmovies.dto.MovieResponse;
import br.com.luizalfredo23.pastelmovies.dto.NamedIdResponse;
import br.com.luizalfredo23.pastelmovies.dto.ReviewResponse;
import br.com.luizalfredo23.pastelmovies.exception.ResourceNotFoundException;
import br.com.luizalfredo23.pastelmovies.model.Actor;
import br.com.luizalfredo23.pastelmovies.model.Genre;
import br.com.luizalfredo23.pastelmovies.model.Movie;
import br.com.luizalfredo23.pastelmovies.model.Review;
import br.com.luizalfredo23.pastelmovies.repository.ActorRepository;
import br.com.luizalfredo23.pastelmovies.repository.GenreRepository;
import br.com.luizalfredo23.pastelmovies.repository.MovieRepository;
import br.com.luizalfredo23.pastelmovies.repository.MovieSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ActorRepository actorRepository;

    @Transactional(readOnly = true)
    public Page<MovieResponse> findAll(String search, Long genreId, Integer year, Pageable pageable) {
        return movieRepository
                .findAll(MovieSpecifications.withFilters(search, genreId, year), pageable)
                .map(m -> toResponse(m, false));
    }

    @Transactional(readOnly = true)
    public MovieResponse findById(Long id) {
        Movie m = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
        return toResponse(m, true);
    }

    @Transactional
    public MovieResponse create(MovieRequest request) {
        Movie m = new Movie();
        applyRequest(m, request);
        return toResponse(movieRepository.save(m), true);
    }

    @Transactional
    public MovieResponse update(Long id, MovieRequest request) {
        Movie m = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
        applyRequest(m, request);
        return toResponse(movieRepository.save(m), true);
    }

    @Transactional
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found: " + id);
        }
        movieRepository.deleteById(id);
    }

    private void applyRequest(Movie m, MovieRequest request) {
        m.setTitle(request.title());
        m.setYear(request.year());
        m.setDuration(request.duration());
        m.setSynopsis(request.synopsis());
        m.setGenres(resolveGenres(request.genreIds()));
        m.setActors(resolveActors(request.actorIds()));
    }

    private Set<Genre> resolveGenres(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        Set<Genre> set = new HashSet<>(genreRepository.findAllById(ids));
        if (set.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more genres were not found");
        }
        return set;
    }

    private Set<Actor> resolveActors(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        Set<Actor> set = new HashSet<>(actorRepository.findAllById(ids));
        if (set.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more actors were not found");
        }
        return set;
    }

    private MovieResponse toResponse(Movie m, boolean includeReviews) {
        List<NamedIdResponse> genres = m.getGenres().stream()
                .map(g -> new NamedIdResponse(g.getId(), g.getName()))
                .sorted((a, b) -> a.name().compareToIgnoreCase(b.name()))
                .collect(Collectors.toList());
        List<NamedIdResponse> actors = m.getActors().stream()
                .map(a -> new NamedIdResponse(a.getId(), a.getName()))
                .sorted((a, b) -> a.name().compareToIgnoreCase(b.name()))
                .collect(Collectors.toList());
        List<ReviewResponse> reviews = includeReviews
                ? m.getReviews().stream()
                .map(this::toReviewResponse)
                .sorted((a, b) -> Long.compare(a.id(), b.id()))
                .collect(Collectors.toList())
                : Collections.emptyList();
        return new MovieResponse(
                m.getId(),
                m.getTitle(),
                m.getYear(),
                m.getDuration(),
                m.getSynopsis(),
                genres,
                actors,
                reviews
        );
    }

    private ReviewResponse toReviewResponse(Review r) {
        return new ReviewResponse(
                r.getId(),
                r.getRating().intValue(),
                r.getComment(),
                r.getMovie().getId(),
                r.getMovie().getTitle(),
                r.getUser().getId(),
                r.getUser().getName()
        );
    }
}

package br.com.luizalfredo23.pastelmovies.service;

import br.com.luizalfredo23.pastelmovies.dto.GenreRequest;
import br.com.luizalfredo23.pastelmovies.dto.GenreResponse;
import br.com.luizalfredo23.pastelmovies.exception.ResourceNotFoundException;
import br.com.luizalfredo23.pastelmovies.model.Genre;
import br.com.luizalfredo23.pastelmovies.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    @Transactional(readOnly = true)
    public Page<GenreResponse> findAll(String search, Pageable pageable) {
        Page<Genre> page = StringUtils.hasText(search)
                ? genreRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : genreRepository.findAll(pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public GenreResponse findById(Long id) {
        return genreRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found: " + id));
    }

    @Transactional
    public GenreResponse create(GenreRequest request) {
        Genre g = new Genre();
        g.setName(request.name());
        return toResponse(genreRepository.save(g));
    }

    @Transactional
    public GenreResponse update(Long id, GenreRequest request) {
        Genre g = genreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found: " + id));
        g.setName(request.name());
        return toResponse(genreRepository.save(g));
    }

    @Transactional
    public void delete(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Genre not found: " + id);
        }
        genreRepository.deleteById(id);
    }

    private GenreResponse toResponse(Genre g) {
        return new GenreResponse(g.getId(), g.getName());
    }
}

package br.com.luizalfredo23.pastelmovies.service;

import br.com.luizalfredo23.pastelmovies.dto.ActorRequest;
import br.com.luizalfredo23.pastelmovies.dto.ActorResponse;
import br.com.luizalfredo23.pastelmovies.exception.ResourceNotFoundException;
import br.com.luizalfredo23.pastelmovies.model.Actor;
import br.com.luizalfredo23.pastelmovies.repository.ActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ActorService {

    private final ActorRepository actorRepository;

    @Transactional(readOnly = true)
    public Page<ActorResponse> findAll(String search, Pageable pageable) {
        Page<Actor> page = StringUtils.hasText(search)
                ? actorRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : actorRepository.findAll(pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ActorResponse findById(Long id) {
        return actorRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found: " + id));
    }

    @Transactional
    public ActorResponse create(ActorRequest request) {
        Actor a = new Actor();
        a.setName(request.name());
        return toResponse(actorRepository.save(a));
    }

    @Transactional
    public ActorResponse update(Long id, ActorRequest request) {
        Actor a = actorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found: " + id));
        a.setName(request.name());
        return toResponse(actorRepository.save(a));
    }

    @Transactional
    public void delete(Long id) {
        if (!actorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Actor not found: " + id);
        }
        actorRepository.deleteById(id);
    }

    private ActorResponse toResponse(Actor a) {
        return new ActorResponse(a.getId(), a.getName());
    }
}

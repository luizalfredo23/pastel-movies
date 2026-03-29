package br.com.luizalfredo23.pastelmovies.repository;

import br.com.luizalfredo23.pastelmovies.model.Actor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {

    Page<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

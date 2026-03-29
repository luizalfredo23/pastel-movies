package br.com.luizalfredo23.pastelmovies.repository;

import br.com.luizalfredo23.pastelmovies.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {

    @EntityGraph(attributePaths = {"genres", "actors", "reviews", "reviews.user"})
    @Override
    Optional<Movie> findById(Long id);

    @EntityGraph(attributePaths = {"genres", "actors"})
    @Override
    Page<Movie> findAll(Specification<Movie> spec, Pageable pageable);
}

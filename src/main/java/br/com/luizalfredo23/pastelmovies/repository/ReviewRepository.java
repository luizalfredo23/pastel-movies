package br.com.luizalfredo23.pastelmovies.repository;

import br.com.luizalfredo23.pastelmovies.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"movie", "user"})
    Page<Review> findByMovieId(Long movieId, Pageable pageable);

    @EntityGraph(attributePaths = {"movie", "user"})
    Page<Review> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"movie", "user"})
    Page<Review> findByMovieIdAndUserId(Long movieId, Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"movie", "user"})
    @Override
    Page<Review> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"movie", "user"})
    @Override
    Optional<Review> findById(Long id);
}

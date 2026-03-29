package br.com.luizalfredo23.pastelmovies.repository;

import br.com.luizalfredo23.pastelmovies.model.Genre;
import br.com.luizalfredo23.pastelmovies.model.Movie;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class MovieSpecifications {

    private MovieSpecifications() {
    }

    public static Specification<Movie> withFilters(String search, Long genreId, Integer year) {
        return (root, query, cb) -> {
            if (query != null) {
                query.distinct(true);
            }
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(cb.coalesce(root.get("synopsis"), "")), pattern)
                ));
            }

            if (genreId != null) {
                Join<Movie, Genre> genres = root.join("genres");
                predicates.add(cb.equal(genres.get("id"), genreId));
            }

            if (year != null) {
                predicates.add(cb.equal(root.get("year"), year));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}

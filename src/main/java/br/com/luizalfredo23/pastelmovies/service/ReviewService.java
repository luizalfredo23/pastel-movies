package br.com.luizalfredo23.pastelmovies.service;

import br.com.luizalfredo23.pastelmovies.dto.ReviewRequest;
import br.com.luizalfredo23.pastelmovies.dto.ReviewResponse;
import br.com.luizalfredo23.pastelmovies.exception.ResourceNotFoundException;
import br.com.luizalfredo23.pastelmovies.model.Movie;
import br.com.luizalfredo23.pastelmovies.model.Review;
import br.com.luizalfredo23.pastelmovies.model.User;
import br.com.luizalfredo23.pastelmovies.repository.MovieRepository;
import br.com.luizalfredo23.pastelmovies.repository.ReviewRepository;
import br.com.luizalfredo23.pastelmovies.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ReviewResponse> findAll(Long movieId, Long userId, Pageable pageable) {
        Page<Review> page;
        if (movieId != null && userId != null) {
            page = reviewRepository.findByMovieIdAndUserId(movieId, userId, pageable);
        } else if (movieId != null) {
            page = reviewRepository.findByMovieId(movieId, pageable);
        } else if (userId != null) {
            page = reviewRepository.findByUserId(userId, pageable);
        } else {
            page = reviewRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ReviewResponse findById(Long id) {
        return reviewRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
    }

    @Transactional
    public ReviewResponse create(ReviewRequest request) {
        Movie movie = movieRepository.findById(request.movieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + request.movieId()));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.userId()));
        Review r = new Review();
        r.setRating(request.rating().shortValue());
        r.setComment(request.comment());
        r.setMovie(movie);
        r.setUser(user);
        return toResponse(reviewRepository.save(r));
    }

    @Transactional
    public ReviewResponse update(Long id, ReviewRequest request) {
        Review r = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
        Movie movie = movieRepository.findById(request.movieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + request.movieId()));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.userId()));
        r.setRating(request.rating().shortValue());
        r.setComment(request.comment());
        r.setMovie(movie);
        r.setUser(user);
        return toResponse(reviewRepository.save(r));
    }

    @Transactional
    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found: " + id);
        }
        reviewRepository.deleteById(id);
    }

    private ReviewResponse toResponse(Review r) {
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

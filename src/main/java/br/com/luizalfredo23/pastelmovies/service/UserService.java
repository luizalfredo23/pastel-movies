package br.com.luizalfredo23.pastelmovies.service;

import br.com.luizalfredo23.pastelmovies.dto.UserRequest;
import br.com.luizalfredo23.pastelmovies.dto.UserResponse;
import br.com.luizalfredo23.pastelmovies.exception.ResourceNotFoundException;
import br.com.luizalfredo23.pastelmovies.model.User;
import br.com.luizalfredo23.pastelmovies.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(String search, Pageable pageable) {
        Page<User> page = StringUtils.hasText(search)
                ? userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search.trim(), search.trim(), pageable)
                : userRepository.findAll(pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        User u = new User();
        u.setName(request.name());
        u.setEmail(request.email());
        return toResponse(userRepository.save(u));
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        u.setName(request.name());
        u.setEmail(request.email());
        return toResponse(userRepository.save(u));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail());
    }
}

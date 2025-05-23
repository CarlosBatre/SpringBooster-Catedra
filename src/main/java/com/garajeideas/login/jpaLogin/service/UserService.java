package com.garajeideas.login.jpaLogin.service;

import com.garajeideas.login.jpaLogin.entity.User;
import com.garajeideas.login.jpaLogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public String getUsernameByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElse(null);
        return user != null ? user.getUsername() : null;
    }
}

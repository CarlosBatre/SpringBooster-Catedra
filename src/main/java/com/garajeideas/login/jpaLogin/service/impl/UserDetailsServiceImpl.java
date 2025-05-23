package com.garajeideas.login.jpaLogin.service.impl;

import com.garajeideas.login.jpaLogin.entity.SecurityUser;
import com.garajeideas.login.jpaLogin.entity.User;
import com.garajeideas.login.jpaLogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Intentar buscar por email primero
        User user = userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                String.format("Usuario %s no encontrado", username))));
        
        return new SecurityUser(user);
    }
}

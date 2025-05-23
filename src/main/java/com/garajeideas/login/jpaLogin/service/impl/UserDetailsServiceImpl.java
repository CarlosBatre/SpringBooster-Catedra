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
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user = userRepository.findByEmail(email);
        if(user == null) {
            // Intentar buscar por username como alternativa
            user = userRepository.findByUsername(email);
            if(user == null) {
                throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
            }
        }
        return new SecurityUser(user);
    }
}

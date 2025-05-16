package sv.edu.udb.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import sv.edu.udb.configuration.security.JwtUtil;
import sv.edu.udb.controller.request.UserRequest;
import sv.edu.udb.controller.response.UserResponse;
import sv.edu.udb.service.SecUserService;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "auth")
public class AuthController {

    private final JwtUtil jwtUtils;
    private final SecUserService secUserService;
    private final AuthenticationManager authenticationManager;

    @PostMapping(path = "sign-in")
    public String authenticateUser(@RequestBody final UserRequest userRequest) {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userRequest.getUsername(),
                        userRequest.getPassword()));
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateToken(userDetails.getUsername());
    }

    @PostMapping("sign-up")
    @ResponseStatus(CREATED)
    public UserResponse registerUser(@Valid @RequestBody final UserRequest userRequest) {
        return secUserService.createUser(userRequest);
    }
}

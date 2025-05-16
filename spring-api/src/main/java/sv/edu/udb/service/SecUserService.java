package sv.edu.udb.service;

import sv.edu.udb.controller.request.UserRequest;
import sv.edu.udb.controller.response.UserResponse;

public interface SecUserService {

    UserResponse createUser(final UserRequest userRequest);
}

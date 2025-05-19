package sv.edu.udb.service.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import sv.edu.udb.controller.response.UserResponse;
import sv.edu.udb.repository.domain.SecurityUser;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T22:03:19-0600",
    comments = "version: 1.6.2, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toUserResponse(SecurityUser securityUser) {
        if ( securityUser == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.username( securityUser.getUsername() );

        return userResponse.build();
    }
}

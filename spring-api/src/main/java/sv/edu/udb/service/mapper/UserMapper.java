package sv.edu.udb.service.mapper;

import org.mapstruct.Mapper;
import sv.edu.udb.controller.response.UserResponse;
import sv.edu.udb.repository.domain.SecurityUser;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(final SecurityUser securityUser);
}

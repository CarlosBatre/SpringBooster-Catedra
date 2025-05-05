package sv.edu.udb.configuration.web;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;
import java.util.List;
/**
 * ApiErrorWrapper DTO.
 */
@Getter
public class ApiErrorWrapper {
    private final List<ApiError> errors = new ArrayList<>();
    /**
     * Add an API error on the list.

     *
     * @param error DTO Object
     */
    public final void addApiError(final ApiError error) {
        errors.add(error);
    }
    /**
     * Add an API error on the list.
     *
     * @param type the error type
     * @param title the title of the error message
     * @param source the origin of the error
     * @param description the message
     */
    public final void addFieldError(final String type, final String title, final String source,
                                    final String description) {
        final ApiError error = ApiError
                .builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .type(type)
                .title(title)
                .description(description)
                .source(source)
                .build();
        errors.add(error);
    }
}
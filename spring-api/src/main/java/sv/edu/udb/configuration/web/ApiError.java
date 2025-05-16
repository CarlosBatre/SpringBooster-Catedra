package sv.edu.udb.configuration.web;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
/**
 * ApiError DTO.
 */
@Getter
@Setter
@Builder
public class ApiError {
    private Integer status;
    private String type;
    private String title;
    @Builder.Default
    private String source = "base";
    private String description;
}
package backend.spectrum.dguonoff.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class UserNotFoundException extends RuntimeException {

    private final HttpStatus status;

    public UserNotFoundException(ResponseEntity errorCode) {
        super(errorCode.getMessage());
        status = errorCode.getStatus();
    }
}

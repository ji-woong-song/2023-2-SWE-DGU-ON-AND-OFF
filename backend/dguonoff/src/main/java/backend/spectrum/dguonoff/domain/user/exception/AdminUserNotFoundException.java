package backend.spectrum.dguonoff.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AdminUserNotFoundException extends RuntimeException{
    private final HttpStatus status;

        public AdminUserNotFoundException(ResponseEntity errorCode) {
            super(errorCode.getMessage());
            status = errorCode.getStatus();
        }
}

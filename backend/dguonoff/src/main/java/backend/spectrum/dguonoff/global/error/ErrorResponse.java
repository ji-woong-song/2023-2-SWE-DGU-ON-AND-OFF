package backend.spectrum.dguonoff.global.error;

import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.Getter;

@Getter
public class ErrorResponse {
    private String message;
    private String code;

    public ErrorResponse(ErrorCode code) {
        this.message = code.getMessage();
        this.code = code.name();
    }

}

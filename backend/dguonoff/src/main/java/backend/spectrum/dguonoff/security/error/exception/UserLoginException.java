package backend.spectrum.dguonoff.security.error.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

public class UserLoginException extends BusinessException {
    public UserLoginException(ErrorCode errorCode) {
        super(errorCode);
    }
}

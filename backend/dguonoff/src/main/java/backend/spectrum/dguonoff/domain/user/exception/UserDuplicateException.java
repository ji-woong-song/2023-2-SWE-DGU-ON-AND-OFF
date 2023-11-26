package backend.spectrum.dguonoff.domain.user.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

public class UserDuplicateException extends BusinessException {
    public UserDuplicateException(ErrorCode errorCode) {
        super(errorCode);
    }
}

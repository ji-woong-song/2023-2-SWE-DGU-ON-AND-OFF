package backend.spectrum.dguonoff.domain.user.exception;

import backend.spectrum.dguonoff.domain.user.entity.Role;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

public class InvalidAccessException extends BusinessException {
    public InvalidAccessException(ErrorCode errorCode, Role role) {
        super(errorCode.getMessage() + " " + role + " 권한이 필요합니다.", errorCode);
    }
}

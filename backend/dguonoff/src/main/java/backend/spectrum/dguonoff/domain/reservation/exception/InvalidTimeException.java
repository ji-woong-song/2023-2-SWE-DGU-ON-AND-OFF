package backend.spectrum.dguonoff.domain.reservation.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

public class InvalidTimeException extends BusinessException {
    public InvalidTimeException(ErrorCode errorCode) {
        super(errorCode);
    }
}

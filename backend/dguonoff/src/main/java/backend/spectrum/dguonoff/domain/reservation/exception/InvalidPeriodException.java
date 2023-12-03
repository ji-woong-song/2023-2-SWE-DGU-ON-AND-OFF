package backend.spectrum.dguonoff.domain.reservation.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.Getter;

@Getter
public class InvalidPeriodException extends BusinessException {
    public InvalidPeriodException(ErrorCode errorCode) {
        super(errorCode);
    }
}

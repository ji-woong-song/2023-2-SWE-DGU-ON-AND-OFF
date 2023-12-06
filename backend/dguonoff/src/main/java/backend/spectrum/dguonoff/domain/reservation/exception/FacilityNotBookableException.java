package backend.spectrum.dguonoff.domain.reservation.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

public class FacilityNotBookableException extends BusinessException {
    public FacilityNotBookableException(ErrorCode errorCode) {
        super(errorCode);
    }
}

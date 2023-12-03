package backend.spectrum.dguonoff.domain.facility.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.Getter;

@Getter
public class FacilityNotFoundException extends BusinessException {
    public FacilityNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}

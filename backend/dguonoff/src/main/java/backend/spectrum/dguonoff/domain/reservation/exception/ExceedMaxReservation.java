package backend.spectrum.dguonoff.domain.reservation.exception;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class ExceedMaxReservation extends BusinessException {
    public ExceedMaxReservation(ErrorCode errorCode, int maxReservationCount) {
        super(errorCode.getMessage() + ": " + maxReservationCount, errorCode);
    }
}

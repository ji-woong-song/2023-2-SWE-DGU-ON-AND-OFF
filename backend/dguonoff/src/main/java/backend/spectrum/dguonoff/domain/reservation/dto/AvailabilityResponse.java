package backend.spectrum.dguonoff.domain.reservation.dto;

import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AvailabilityResponse { //시설물 예약 가능 조회 응답
    DateConstraint dateConstraint; //예약 가능 기간
    String message; //응답 메세지
}

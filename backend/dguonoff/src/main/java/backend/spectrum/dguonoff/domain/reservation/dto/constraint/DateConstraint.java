package backend.spectrum.dguonoff.domain.reservation.dto.constraint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DateConstraint {
    private int maxDate; //최대 몇일 전부터 예약 가능한지
    private int minDate; //최소 몇일 전까지 예약 가능한지

}

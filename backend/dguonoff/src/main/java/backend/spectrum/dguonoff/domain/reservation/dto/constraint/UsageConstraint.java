package backend.spectrum.dguonoff.domain.reservation.dto.constraint;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsageConstraint {
    private int max_time; //최대 이용 가능 시간
    private int min_personnel; //최소 인원
    private int max_personnel; //최대 인원
}

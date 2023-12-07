package backend.spectrum.dguonoff.domain.fixedSchedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PostNewScheduleResponse {
    private final Long scheduleId;
}

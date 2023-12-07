package backend.spectrum.dguonoff.domain.fixedSchedule.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateScheduleRequest {
    private final Long scheduleId;
    private final PostNewScheduleRequest scheduleInfo;
}

package backend.spectrum.dguonoff.domain.admin.dto;

import backend.spectrum.dguonoff.domain.admin.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DailyScheduleResponse {
    private final Long id;
    private final DayOfWeek day;
    private final PeriodDTO<LocalTime> time;
    private final EventInfoDTO event;
}

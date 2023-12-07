package backend.spectrum.dguonoff.domain.fixedSchedule.dto;

import backend.spectrum.dguonoff.domain.fixedSchedule.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.common.FacilityKeyDTO;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.common.PeriodDTO;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostNewScheduleRequest {
    private final FacilityKeyDTO facility;
    private final PeriodDTO<LocalDate> effectiveDate;
    private final DayOfWeek day;
    private final PeriodDTO<LocalTime> time;
    private final EventInfoDTO event;
}

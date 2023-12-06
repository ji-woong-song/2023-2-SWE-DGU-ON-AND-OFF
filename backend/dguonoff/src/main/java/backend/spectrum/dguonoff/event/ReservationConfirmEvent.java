package backend.spectrum.dguonoff.event;

import backend.spectrum.dguonoff.dao.model.ReservationStatus;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationConfirmEvent {
    private final String toEmail;
    private final String buildingName;
    private final String facilityName;
    private final LocalDate date;
    private final PeriodDTO<LocalTime> period;
    private final ReservationStatus status;
}

package backend.spectrum.dguonoff.domain.facility.dto;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
@AllArgsConstructor
public class NextReservationResponse {
    private FacilityStatus status;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}

package backend.spectrum.dguonoff.domain.reservation.dto;

import backend.spectrum.dguonoff.DAO.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Column;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ReservationInfoResponse {
    private Long reservationId;
    private String title;
    private ReservationStatus status;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String facilityCode;
    private String outline;
    private String purpose;
    private List<GuestInfo> guests;


}
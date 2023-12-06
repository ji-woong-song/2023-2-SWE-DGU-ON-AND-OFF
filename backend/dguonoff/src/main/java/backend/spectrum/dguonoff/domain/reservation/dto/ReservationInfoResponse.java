package backend.spectrum.dguonoff.domain.reservation.dto;

import backend.spectrum.dguonoff.dao.model.FacilityStatus;
import backend.spectrum.dguonoff.dao.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

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
    private String buildingName;
    private String facilityName;
    private FacilityStatus facilityState;
    private String outline;
    private String purpose;
    private HostUserInfo host;
    private List<GuestInfo> guests;


}
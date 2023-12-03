package backend.spectrum.dguonoff.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ReservationRequest {
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String facilityCode;
    private String outline;
    private String purpose;
    private List<String> guestIds;

}

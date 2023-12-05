package backend.spectrum.dguonoff.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ReservationModificationRequest {
    private Long reservationId;
    private String outline;

}

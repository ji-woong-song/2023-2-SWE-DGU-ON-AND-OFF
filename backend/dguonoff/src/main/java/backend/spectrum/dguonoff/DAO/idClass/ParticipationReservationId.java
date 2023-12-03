package backend.spectrum.dguonoff.DAO.idClass;

import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationReservationId implements Serializable {
    private String userId;
    private Long reservationId;
}

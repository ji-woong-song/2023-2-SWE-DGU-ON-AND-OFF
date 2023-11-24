package backend.spectrum.dguonoff.DAO.idClass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationReservationId implements Serializable {
    private String userId;
    private String reservationId;
}

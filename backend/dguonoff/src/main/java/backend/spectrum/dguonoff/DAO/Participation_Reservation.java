package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.idClass.ParticipationReservationId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "Participation_Reservation")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Participation_Reservation {

    @EmbeddedId
    private ParticipationReservationId bookmarkId;


    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    private User guestId;

    @ManyToOne
    @MapsId("reservationId")
    private Reservation reservationId;

}

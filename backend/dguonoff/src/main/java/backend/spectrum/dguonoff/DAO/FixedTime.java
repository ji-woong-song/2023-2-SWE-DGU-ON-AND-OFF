package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.idClass.FixedTimeId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "FixedTime")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedTime {

    @EmbeddedId
    private FixedTimeId fixedTimeId;

    @MapsId("facilityId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    private FixedReservation reservationId;
}

package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.idClass.FixedTimeId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "FixedTime")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedTime {

    @EmbeddedId
    private FixedTimeId fixedTimeId;

    @Column(nullable = false, insertable = false, updatable = false)
    private DayOfWeek day;

    @Column(nullable = false, insertable = false, updatable = false)
    private LocalTime startTime;

    @Column(nullable = false, insertable = false, updatable = false)
    private LocalTime endTime;

    @MapsId("facilityId")
    @ManyToOne(fetch = FetchType.LAZY)
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    private FixedReservation reservationId;


}

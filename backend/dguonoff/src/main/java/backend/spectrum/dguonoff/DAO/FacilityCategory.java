package backend.spectrum.dguonoff.DAO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FacilityCategory")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FacilityCategory {

    @Id
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "min_user", nullable = false)
    private Integer minUser;

    @Column(name = "max_reservation", nullable = false)
    private Integer maxReservation;

    @Column(name = "max_reservation_period", nullable = false)
    private Integer maxReservationPeriod;

    @Column(name = "max_time")
    private Integer max_time;

    @Column(name = "reservation_start")
    private Integer reservationStart;

    @Column(name = "reservation_deadline")
    private Integer reservationDeadline;


}

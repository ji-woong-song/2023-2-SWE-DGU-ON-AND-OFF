package backend.spectrum.dguonoff.dao;

import backend.spectrum.dguonoff.dao.model.ReservationPeriod;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "FacilityCategory")
@Getter
@Builder
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

    @Enumerated(EnumType.STRING)
    @Column(name = "max_reservation_period", nullable = false, columnDefinition = "VARCHAR(25)")
    private ReservationPeriod maxReservationPeriod;

    @Column(name = "max_time")
    private Integer max_time;

    @Column(name = "reservation_start")
    private Integer reservationStart;

    @Column(name = "reservation_deadline")
    private Integer reservationDeadline;


}

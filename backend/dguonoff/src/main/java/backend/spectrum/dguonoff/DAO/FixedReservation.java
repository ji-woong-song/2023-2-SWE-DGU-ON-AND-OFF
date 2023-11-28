package backend.spectrum.dguonoff.DAO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "FixedReservation")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedReservation {
    @Id
    @Column(name = "reservation_id", nullable = false)
    private Long ReservationId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "reservation_host", nullable = false)
    private Long reservationHost;

    @Column(name = "host_user", nullable = false)
    private String hostUser;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;





}

package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.model.ReservationStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Setter;

@Entity
@Table(name = "Reservation")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {
    @Id
    @Column(name = "reservation_id", nullable = false)
    private Long reservationId;

    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer guestNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    private User hotUserId;

    @OneToMany(mappedBy = "reservationId")
    private List<Participation_Reservation> guestUserId = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private Event event;
    public void setEvent(Event event) {
        this.event = event;
        this.event.addReservation(this);
    }
}

package backend.spectrum.dguonoff.dao;

import backend.spectrum.dguonoff.dao.model.ReservationStatus;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "FixedSchedule", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
            "start_date", "end_date", "day", "start_time", "end_time", "facility_id"
    })
})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fixed_schedule_id", nullable = false)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "day", nullable = false)
    private DayOfWeek day;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer guestNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    private User reservationAdmin;

    @OneToOne(cascade = CascadeType.ALL)
    private Event event;

    public void setEvent(Event event) {
        this.event = event;
    }
    private Reservation toReservation(LocalDate date) {
        return Reservation.builder()
                .date(date)
                .hotUserId(reservationAdmin)
                .status(ReservationStatus.APPROVED)
                .startTime(startTime)
                .endTime(endTime)
                .event(event)
                .guestNumber(guestNumber)
                .build();
    }

    /**
     * 자신의 정보를 토대로 event에 예약 정보를 넣어준다.
     * @return
     */
    public List<Reservation> reserve() {
        List<Reservation> result = new ArrayList<>();
        LocalDate date = LocalDate.from(startDate);

        if (LocalDate.now().isAfter(startDate)) {
            date = LocalDate.now();
        }
        int searchInterval = 1;
        while (date.isBefore(endDate) || date.equals(endDate)) {
            if (date.getDayOfWeek().getValue() == day.getValue()) {
                searchInterval = 7;
                Reservation reservation = toReservation(date);
                reservation.setEvent(event);
                reservation.setFacility(facility);
            }
            date = date.plusDays(searchInterval);
        }
        return result;
    }
}

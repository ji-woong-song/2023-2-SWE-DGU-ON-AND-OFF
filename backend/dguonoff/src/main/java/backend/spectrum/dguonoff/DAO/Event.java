package backend.spectrum.dguonoff.DAO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String hostName;

    @Column
    private String name;

    @Column
    private String outline;

    @Column
    private String purpose;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    public void addReservation(Reservation reservation) {
        this.reservations.add(reservation);
    }

    /**
     * 현재 기준 아직 시작하지 않은 예약정보들을 삭제한다.
     * @param today
     * @param now
     */
    public void cancelReservation(LocalDate today, LocalTime now) {
        List<Reservation> futureReservation = this.reservations.stream()
                .filter(reservation -> reservation.getDate().isAfter(today) ||
                        (reservation.getDate().equals(today) && reservation.getStartTime().isAfter(now)))
                .collect(Collectors.toList());
        this.reservations.removeAll(futureReservation);
    }

    /**
     * 현재 시간 기준으로 끝난 예약 정보들을 가져온다.
     * @param today
     * @param now
     * @return
     */
    public List<Reservation> getPastReservation(LocalDate today, LocalTime now) {
        return reservations.stream().filter(reservation -> reservation.getDate().isBefore(today) ||
                (reservation.getDate().equals(today) && reservation.getEndTime().isBefore(now)))
                .collect(Collectors.toList());
    }

    /**
     * 현재 시간 기준으로 시작하지 않은 예약을 다른 event로 옮긴다.
     * @param today
     * @param now
     * @param otherEvent
     */
    public void moveReservation(LocalDate today, LocalTime now, Event otherEvent){
        List<Reservation> futureReservation = this.reservations.stream()
                .filter(reservation -> reservation.getDate().isAfter(today) ||
                        (reservation.getDate().equals(today) && reservation.getStartTime().isAfter(now)))
                .collect(Collectors.toList());
        futureReservation.forEach(reservation -> reservation.setEvent(otherEvent));
        this.reservations.removeAll(reservations);
    }

    /**
     * 모든 예약을 삭제합니다.
     */
    public void clearReservation() {
        this.reservations.clear();
    }
}

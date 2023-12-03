package backend.spectrum.dguonoff.DAO;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
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

    @OneToMany(mappedBy = "reservationId", cascade = CascadeType.ALL)
    private List<Reservation> reservations;

    public void addReservation(Reservation reservation) {
        List<Reservation> reservationList = new ArrayList<Reservation>();
        reservationList.add(reservation);
        this.reservations = reservationList;
    }
}

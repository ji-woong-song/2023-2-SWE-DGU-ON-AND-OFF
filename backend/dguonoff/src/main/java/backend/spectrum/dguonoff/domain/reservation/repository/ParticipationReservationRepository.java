package backend.spectrum.dguonoff.domain.reservation.repository;

import backend.spectrum.dguonoff.DAO.Participation_Reservation;
import backend.spectrum.dguonoff.DAO.Reservation;
import backend.spectrum.dguonoff.DAO.idClass.ParticipationReservationId;
import backend.spectrum.dguonoff.domain.reservation.dto.GuestInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ParticipationReservationRepository extends JpaRepository<Participation_Reservation, ParticipationReservationId> {
    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.GuestInfo(p.guestId.id, p.guestId.name) from Participation_Reservation p where p.reservationId.reservationId = ?1")
    List<GuestInfo> findGuestInfoByReservation(Long reservationId);
    @Transactional
    @Modifying
    @Query("delete from Participation_Reservation p where p.reservationId = ?1")
    int deleteAllByReservation(Reservation reservationId);

}

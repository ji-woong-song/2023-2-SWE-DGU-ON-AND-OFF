package backend.spectrum.dguonoff.domain.facility.repository;

import backend.spectrum.dguonoff.DAO.Facility;
import java.util.List;
import java.util.Optional;

import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findAllByBuilding_NameAndFloorAndIsBookable(String buildingName, Integer floor, Boolean bookable);
    List<Facility> findAllByBuilding_NameAndFloor(String buildingName, Integer floor);
    Optional<Facility> findByBuilding_NameAndCode(String buildingName, String code);

    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint(f.category.reservationStart, f.category.reservationDeadline) from Facility f where f.code = ?1")
    Optional<DateConstraint> findDateConstraint(@NonNull String facilityCode);

    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint(f.category.maxReservation, f.category.maxReservationPeriod, f.category.name) from Facility f where f.code = ?1")
    Optional<MaxReservationConstraint> findReservationConstraint(@NonNull String facilityCode);

}

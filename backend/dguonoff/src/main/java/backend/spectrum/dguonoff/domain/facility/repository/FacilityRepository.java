package backend.spectrum.dguonoff.domain.facility.repository;

import backend.spectrum.dguonoff.DAO.Facility;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import backend.spectrum.dguonoff.DAO.Reservation;
import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.UsageConstraint;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    @Query("select f from Facility f where f.code = ?1")
    Optional<Facility> findByCode(String code);
    List<Facility> findAllByBuilding_NameAndFloorAndIsBookable(String buildingName, Integer floor, Boolean bookable);
    List<Facility> findAllByBuilding_NameAndFloor(String buildingName, Integer floor);
    Optional<Facility> findByBuilding_NameAndCode(String buildingName, String code);

    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint(f.category.reservationStart, f.category.reservationDeadline) from Facility f where f.code = ?1")
    Optional<DateConstraint> findDateConstraint(@NonNull String facilityCode);

    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint(f.category.maxReservation, f.category.maxReservationPeriod, f.category.name) from Facility f where f.code = ?1")
    Optional<MaxReservationConstraint> findReservationConstraint(@NonNull String facilityCode);

    @Query("select new backend.spectrum.dguonoff.domain.reservation.dto.constraint.UsageConstraint(f.category.max_time, f.category.minUser, f.capacity) from Facility f where f.code = ?1")
    Optional<UsageConstraint> findFacilityUsageConstraint(String facilityCode);

    @Query("select f.state from Facility f where f.code = ?1")
    Optional<FacilityStatus> findStatusByFacilityCode(String facilityCode);

    @Transactional
    @Modifying
    @Query("update Facility f set f.state = ?1 where f.code = ?2")
    int updateFacilityStatus(FacilityStatus state, String facilityCode);

}

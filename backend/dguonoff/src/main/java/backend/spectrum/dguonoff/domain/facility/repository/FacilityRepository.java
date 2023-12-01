package backend.spectrum.dguonoff.domain.facility.repository;

import backend.spectrum.dguonoff.DAO.Facility;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findAllByBuilding_NameAndFloorAndIsBookable(String buildingName, Integer floor, Boolean bookable);
    List<Facility> findAllByBuilding_NameAndFloor(String buildingName, Integer floor);
    Optional<Facility> findByBuilding_NameAndCode(String buildingName, String code);
}

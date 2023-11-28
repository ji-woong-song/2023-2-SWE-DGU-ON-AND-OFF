package backend.spectrum.dguonoff.domain.facility.repository;

import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, FacilityPK> {
    List<Facility> findAllByBuilding_NameAndFloorAndIsBookable(String buildingName, Integer floor, Boolean bookable);
}

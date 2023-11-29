package backend.spectrum.dguonoff.domain.facility.repository;


import backend.spectrum.dguonoff.DAO.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BuildingRepository extends JpaRepository<Building, String> {
}

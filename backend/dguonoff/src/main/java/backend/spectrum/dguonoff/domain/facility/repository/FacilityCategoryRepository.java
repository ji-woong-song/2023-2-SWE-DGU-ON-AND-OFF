package backend.spectrum.dguonoff.domain.facility.repository;

import backend.spectrum.dguonoff.dao.FacilityCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityCategoryRepository extends JpaRepository<FacilityCategory, String> {
}

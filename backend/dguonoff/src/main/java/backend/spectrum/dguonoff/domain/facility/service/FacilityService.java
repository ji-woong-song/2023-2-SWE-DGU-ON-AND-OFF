package backend.spectrum.dguonoff.domain.facility.service;

import backend.spectrum.dguonoff.DAO.Building;
import backend.spectrum.dguonoff.domain.facility.repository.BuildingRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FacilityService {
    private final BuildingRepository buildingRepository;
    private final FacilityRepository facilityRepository;

    public List<String> getAllBuildingNames() {
        List<Building> all = buildingRepository.findAll();
        return all.stream().map(Building::getName)
                .collect(Collectors.toList());
    }
}

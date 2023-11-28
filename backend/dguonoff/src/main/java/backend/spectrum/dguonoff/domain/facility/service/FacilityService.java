package backend.spectrum.dguonoff.domain.facility.service;

import backend.spectrum.dguonoff.DAO.Building;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.domain.facility.dto.FacilityOutlineDTO;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityRequest;
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

    public FloorFacilityListResponse getFacilityList(String buildingName, Integer floor, Boolean bookable) {
        List<Facility> facilities = facilityRepository.findAllByBuildingAndFloorAndIsBookable(
                buildingName, floor, bookable);
        List<FacilityOutlineDTO> outlines = facilities.stream().map(
                facility ->
                        FacilityOutlineDTO.builder()
                                .id(facility.getId().getFacilityId())
                                .bookmarked(false)
                                .status(facility.getState())
                                .name(facility.getName())
                                .build()
        ).collect(Collectors.toList());
        return FloorFacilityListResponse.builder()
                .floor(floor)
                .facility(outlines)
                .build();
    }
}

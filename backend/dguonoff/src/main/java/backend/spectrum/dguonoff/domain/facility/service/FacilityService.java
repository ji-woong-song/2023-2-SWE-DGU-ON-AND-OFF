package backend.spectrum.dguonoff.domain.facility.service;

import backend.spectrum.dguonoff.DAO.Bookmark;
import backend.spectrum.dguonoff.DAO.Building;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.facility.converter.FacilityConverter;
import backend.spectrum.dguonoff.domain.facility.dto.FacilityOutlineDTO;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.repository.BuildingRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FacilityService {
    private final BuildingRepository buildingRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public List<String> getAllBuildingNames() {
        List<Building> all = buildingRepository.findAll();
        return all.stream().map(Building::getName)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FloorFacilityListResponse getFacilityList(String userId, Integer floor, String buildingName) {
        // 유저 정보를 가져온다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        List<Bookmark> userBookmarks = user.getBookmarks();
        // 시설물 정보를 가져온다.
        List<Facility> facilities = facilityRepository.findAllByBuilding_NameAndFloorAndIsBookable(
               buildingName, floor, true);
        // 북마크 정보를 반영한다.
        List<FacilityOutlineDTO> outlines = getFacilityOutlines(buildingName, userBookmarks, facilities);

        return FloorFacilityListResponse.builder()
                .floor(floor)
                .facility(outlines)
                .build();
    }

    @Transactional(readOnly = true)
    public FloorFacilityListResponse getAllFacilityList(String userId, Integer floor, String buildingName) {
        // 유저 정보를 가져온다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        List<Bookmark> userBookmarks = user.getBookmarks();
        // 시설물 정보를 가져온다.
        List<Facility> facilities = facilityRepository.findAllByBuilding_NameAndFloor(
                buildingName, floor);
        // 북마크 정보를 반영한다.
        List<FacilityOutlineDTO> outlines = getFacilityOutlines(buildingName, userBookmarks, facilities);

        return FloorFacilityListResponse.builder()
                .floor(floor)
                .facility(outlines)
                .build();
    }

    private static List<FacilityOutlineDTO> getFacilityOutlines(String buildingName,
                                                                   List<Bookmark> userBookmarks,
                                                                   List<Facility> facilities) {
        // entity를 dto로 바꾼다.
        List<FacilityOutlineDTO> outlines = facilities.stream()
                .map(FacilityConverter::toFacilityOutlineDTO)
                .collect(Collectors.toList());
        // 등록된 bookmark 정보를 반영한다.
        outlines.forEach(outline-> {
            Optional<Bookmark> matched = userBookmarks.stream().filter(bookmark ->
                bookmark.getFacility().getCode().equals(outline.getCode()) &&
                        bookmark.getFacility().getBuilding().getName().equals(buildingName)
            ).findAny();
            if (matched.isPresent())
                outline.setBookmarked(true);
        });
        return outlines;
    }

}

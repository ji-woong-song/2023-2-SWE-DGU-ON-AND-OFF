package backend.spectrum.dguonoff.domain.facility.service;

import backend.spectrum.dguonoff.dao.*;
import backend.spectrum.dguonoff.dao.model.FacilityStatus;
import backend.spectrum.dguonoff.domain.facility.converter.FacilityConverter;
import backend.spectrum.dguonoff.domain.facility.dto.BuildingDTO;
import backend.spectrum.dguonoff.domain.facility.dto.FacilityOutlineDTO;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.dto.NextReservationResponse;
import backend.spectrum.dguonoff.domain.facility.exception.FacilityNotFoundException;
import backend.spectrum.dguonoff.domain.facility.repository.BuildingRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.UsageConstraint;
import backend.spectrum.dguonoff.domain.reservation.repository.ReservationRepository;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static backend.spectrum.dguonoff.dao.model.FacilityStatus.USING;
import static backend.spectrum.dguonoff.dao.model.ReservationStatus.APPROVED;

@Service
@Slf4j
@RequiredArgsConstructor
public class FacilityService {
    private final ReservationRepository reservationRepository;
    private final BuildingRepository buildingRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public List<BuildingDTO> getAllBuilding() {
        List<Building> all = buildingRepository.findAll();
        return all.stream()
                .map(building -> new BuildingDTO(building.getName(), building.getMaxFloor()))
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
        outlines.forEach(outline -> {
            Optional<Bookmark> matched = userBookmarks.stream().filter(bookmark ->
                    bookmark.getFacility().getCode().equals(outline.getCode()) &&
                            bookmark.getFacility().getBuilding().getName().equals(buildingName)
            ).findAny();
            if (matched.isPresent())
                outline.setBookmarked(true);
        });
        return outlines;
    }

    //시설물의 이용 제약조건을 반환하는 함수
    public UsageConstraint getUsageConstraint(String facilityCode, String buildingName) {
        UsageConstraint constraint = facilityRepository.findFacilityUsageConstraint(facilityCode, buildingName)
                .orElseThrow(() -> new FacilityNotFoundException(ErrorCode.NOT_EXIST_FACILITY));
        return constraint;
    }

    //특정 시설물의 이용상태 반환 함수
    public FacilityStatus getFacilityStatus(String facilityCode, String buildingName) {
        FacilityStatus status = facilityRepository.findStatusByFacilityCode(facilityCode, buildingName)
                .orElseThrow(() -> new FacilityNotFoundException(ErrorCode.NOT_EXIST_FACILITY));
        return status;
    }

    //시설물 이용 상태 종료 함수
    public void endFacility(String facilityCode, String buildingName) {
        facilityRepository.updateFacilityStatus(FacilityStatus.EMPTY, facilityCode, buildingName);
    }

    //시설물의 다음 예약 정보를 반환하는 함수
    public NextReservationResponse getNextReservation(String facilityCode) {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalTime currentTime = LocalTime.now();
        FacilityStatus status = USING;

        List<Reservation> reservations = reservationRepository.findReservationsAfterYesterday(facilityCode, yesterday, APPROVED)
                .orElseThrow(() -> new FacilityNotFoundException(ErrorCode.NEXT_RESERVATION_NOT_EXIST_FACILITY));

        // 이미 실행 중인 예약 찾기
        Optional<Reservation> nearestReservation = findOngoingReservation(currentTime, reservations);

        // 실행 중인 예약이 없다면 현재 시각 이후의 예약 중에서 가장 가까운 예약 찾기
        if (!nearestReservation.isPresent()) {
            nearestReservation = findNearestReservation(currentTime, reservations);
            if(!nearestReservation.isPresent()) {
                throw new FacilityNotFoundException(ErrorCode.NEXT_RESERVATION_NOT_EXIST_FACILITY);
            }
            status = FacilityStatus.EMPTY;
        }

        return NextReservationResponse.builder()
                .status(status)
                .date(nearestReservation.get().getDate())
                .startTime(nearestReservation.get().getStartTime())
                .endTime(nearestReservation.get().getEndTime())
                .build();
    }

    private Optional<Reservation> findNearestReservation(LocalTime currentTime, List<Reservation> reservations) {
        return reservations.stream()
                .filter(reservation -> reservation.getStartTime().isAfter(currentTime))
                .findFirst();
    }

    private Optional<Reservation> findOngoingReservation(LocalTime currentTime, List<Reservation> reservations) {
        return reservations.stream()
                .filter(reservation -> reservation.getStartTime().isBefore(currentTime) &&
                        reservation.getEndTime().isAfter(currentTime))
                .findFirst();
    }
}

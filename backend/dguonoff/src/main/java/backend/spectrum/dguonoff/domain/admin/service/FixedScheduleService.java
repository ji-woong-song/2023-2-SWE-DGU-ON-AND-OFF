package backend.spectrum.dguonoff.domain.admin.service;

import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.FixedSchedule;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import backend.spectrum.dguonoff.domain.admin.converter.FixedScheduleConverter;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import backend.spectrum.dguonoff.domain.admin.repository.FixedScheduleRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.global.util.IntervalUtil;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FixedScheduleService {
    private final FixedScheduleRepository fixedScheduleRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public List<DailyScheduleResponse> getFixedTimeTables(DailyScheduleRequest request) {
        List<FixedSchedule> schedules = fixedScheduleRepository.findByDayAndStartDateBetweenAndFacility_Building_BuildingNameAndFacility_Id(
                request.getDay(),
                request.getEffectiveDate().getStart(),
                request.getEffectiveDate().getEnd(),
                request.getFacility().getBuildingName(),
                request.getFacility().getId()
        );
        return schedules.stream()
                .map(FixedScheduleConverter::toFixedScheduleDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostNewScheduleResponse enrollFixedTimeTable(String adminId, PostNewScheduleRequest request) {
        // 시설물 id로 시설물을 찾는다.
        Facility facility = facilityRepository.findById(
                new FacilityPK(
                        request.getFacility().getBuildingName(),
                        request.getFacility().getId()
                )
        ).orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_FACILITY));
        // 유저 id로 유저를 찾는다.
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_USER));

        List<FixedSchedule> alreadyScheduled = fixedScheduleRepository.findByDayAndStartDateBetweenAndFacility_Building_BuildingNameAndFacility_Id(
                request.getDay(), request.getEffectiveDate().getStart(), request.getEffectiveDate().getEnd(),
                request.getFacility().getBuildingName(), request.getFacility().getId()
        );
        // 시간대가 겹치는지 확인
        for (FixedSchedule schedule : alreadyScheduled) {
            PeriodDTO<LocalTime> scheduledInterval = new PeriodDTO<>(schedule.getStartTime(), schedule.getEndTime());
            // 겹친다면 예외를 발생시킨다.
            if (IntervalUtil.isOverlapped(request.getTime(), scheduledInterval)) {
                throw new BusinessException(ErrorCode.EXIST_OVERLAPPED_INTERVAL);
            }
        }
        FixedSchedule fixedSchedule = fixedScheduleRepository.save(
                FixedScheduleConverter.toFixedScheduleEntity(request, facility, admin));
        return PostNewScheduleResponse.builder()
                .scheduleId(fixedSchedule.getId())
                .build();
    }
}

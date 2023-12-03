package backend.spectrum.dguonoff.domain.admin.service;

import backend.spectrum.dguonoff.DAO.Event;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.FixedSchedule;
import backend.spectrum.dguonoff.DAO.Reservation;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.admin.converter.FixedScheduleConverter;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.UpdateScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.UpdateScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import backend.spectrum.dguonoff.domain.admin.repository.FixedScheduleRepository;
import backend.spectrum.dguonoff.domain.admin.repository.TempReservationRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.global.util.IntervalUtil;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class FixedScheduleService {
    private final TempReservationRepository tempReservationRepository;
    private final UserRepository userRepository;
    private final FixedScheduleRepository fixedScheduleRepository;
    private final FacilityRepository facilityRepository;

    @Transactional(readOnly = true)
    public List<DailyScheduleResponse> getFixedTimeTables(DailyScheduleRequest request) {
        List<FixedSchedule> schedules = fixedScheduleRepository.findByDayAndStartDateBetweenAndFacility_Building_NameAndFacility_Id(
                request.getDay(),
                request.getEffectiveDate().getStart(),
                request.getEffectiveDate().getEnd(),
                request.getFacility().getBuildingName(),
                request.getFacility().getCode()
        );
        return schedules.stream()
                .map(FixedScheduleConverter::toFixedScheduleDTO)
                .collect(Collectors.toList());
    }

    public PostNewScheduleResponse enrollFixedTimeTable(String adminId, PostNewScheduleRequest request) {
        // 시설물 id로 시설물을 찾는다.
        Facility facility = facilityRepository.findByBuilding_NameAndCode(
                request.getFacility().getBuildingName(),
                request.getFacility().getCode()
        ).orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_FACILITY));

        // 유저 id로 유저를 찾는다.
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_USER));
        // 겹치는 고정 시간표가 있는지 확인
        checkOverlappedScheduled(request);
        FixedSchedule fixedSchedule = FixedScheduleConverter.toFixedScheduleEntity(request, facility, admin);
        // 겹치지 않았다면 해당 시간표 대로 주어진 기간에 주어진 시간대에 예약을 한다.
        // 처음 요일이 맞는 날짜를 찾고, 찾고 나서는 7일씩 증가시켜서 예약을 한다.
        LocalDate startDate = request.getEffectiveDate().getStart();
        LocalDate endDate = request.getEffectiveDate().getEnd();
        LocalDate date = LocalDate.from(startDate);
        int searchInterval = 1;
        while (date.isBefore(endDate) || date.equals(endDate)) {
            if (date.getDayOfMonth() == request.getDay().getValue()) {
                searchInterval = 7;
//                fixedSchedule.addReservation(date, request.getEvent().getGuestNumber());
            }
            date = date.plusDays(searchInterval);
        }
        facilityRepository.save(facility);
        return PostNewScheduleResponse.builder()
                .scheduleId(fixedSchedule.getId())
                .build();
    }

    private void checkOverlappedScheduled(PostNewScheduleRequest request) {
        // [start, end] 유효기간의 인자로 들어온 요일, 건물명, 시설물 코드로 기존 스케쥴 정보를 가져온다.
        List<FixedSchedule> alreadyScheduled = fixedScheduleRepository.findByDayAndStartDateBetweenAndFacility_Building_NameAndFacility_Id(
                request.getDay(), request.getEffectiveDate().getStart(), request.getEffectiveDate().getEnd(),
                request.getFacility().getBuildingName(), request.getFacility().getCode()
        );
        // 시간대가 겹치는지 확인
        for (FixedSchedule schedule : alreadyScheduled) {
            PeriodDTO<LocalTime> scheduledInterval = new PeriodDTO<>(schedule.getStartTime(), schedule.getEndTime());
            // 겹친다면 예외를 발생시킨다.
            if (IntervalUtil.isOverlapped(request.getTime(), scheduledInterval)) {
                throw new BusinessException(ErrorCode.EXIST_OVERLAPPED_INTERVAL);
            }
        }
    }

    public UpdateScheduleResponse updateSchedule(String userId, UpdateScheduleRequest request) {
        FixedSchedule schedule = fixedScheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_SCHEDULE));
        // 관련이벤트 update
        // 지난 예약이 있는지 확인
        List<Reservation> passedReservation = tempReservationRepository.findByDateLessThanEqualOrDateEqualAndStartTimeBeforeAndEvent_EventId(
                LocalDate.now(), LocalTime.now(), schedule.getEvent().getId()
        );
        // 지난 예약 정보에 대해서는 지금과 같은 event 값을 갖는 다른 event 객체와 맵핑
        if (!passedReservation.isEmpty()) {

        }
        Event event = schedule.getEvent();
        if (isEventInfoChanged(schedule, request.getScheduleInfo().getEvent())) {

        }
        // 관련 예약 정보 update

        // 예약 정보 모두 지우기
        enrollFixedTimeTable(userId, request.getScheduleInfo());

        return new UpdateScheduleResponse(schedule.getId());
    }

    public void updateReservation(FixedSchedule schedule,
                                  Facility newFacility,
                                  PostNewScheduleRequest updatedSchedule) {
        if (isScheduleTimeChanged(schedule, updatedSchedule, newFacility)) {

        }
    }

    public String removeSchedule(Long scheduleId) {
        FixedSchedule fixedSchedule = this.fixedScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_SCHEDULE));
        this.fixedScheduleRepository.delete(fixedSchedule);
        return "success";
    }

    /**
     * 이벤트 자체 정보가 변경 되었는지 확인
     * (이벤트명, 이벤트 주선자 이름, 이벤트 목적, 이벤트 개요)
     * @param schedule
     * @param dto
     * @return
     */
    private boolean isEventInfoChanged(FixedSchedule schedule, EventInfoDTO dto) {
        Event event = schedule.getEvent();
        return (!event.getPurpose().equals(dto.getPurpose())) ||
                (!event.getOutline().equals(dto.getPurpose())) ||
                (!event.getName().equals(dto.getName())) ||
                (!event.getHostName().equals(dto.getHostName())) ||
                (!schedule.getGuestNumber().equals(dto.getGuestNumber()));
    }
    /**
     * 예약 정보가 변경되었는지 확인
     * @param schedule
     * @param request 업데이트 시도하는 값들
     * @param newFacility
     * @return
     */
    private boolean isScheduleTimeChanged(FixedSchedule schedule,
                                          PostNewScheduleRequest request,
                                          Facility newFacility) {
        return (!schedule.getEndTime().equals(request.getEffectiveDate().getEnd())) ||
                (!schedule.getStartTime().equals(request.getTime().getStart())) ||
                (!schedule.getEndDate().equals(request.getEffectiveDate().getEnd())) ||
                (!schedule.getStartTime().equals(request.getEffectiveDate().getStart())) ||
                (!schedule.getDay().equals(request.getDay())) ||
                (!schedule.getFacility().getId().equals(newFacility.getId()));
    }
}

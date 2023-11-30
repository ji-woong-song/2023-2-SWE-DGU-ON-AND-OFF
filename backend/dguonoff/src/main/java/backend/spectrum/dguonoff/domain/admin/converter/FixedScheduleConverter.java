package backend.spectrum.dguonoff.domain.admin.converter;

import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.FixedSchedule;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;

public class FixedScheduleConverter {
    public static EventInfoDTO toEventDTO(FixedSchedule fixedSchedule) {
        return EventInfoDTO.builder()
                .purpose(fixedSchedule.getPurpose())
                .outline(fixedSchedule.getOutline())
                .name(fixedSchedule.getEventTitle())
                .hostName(fixedSchedule.getHostUser())
                .guestNumber(fixedSchedule.getFacility().getCapacity())
                .build();
    }

    public static DailyScheduleResponse toFixedScheduleDTO(FixedSchedule fixedSchedule) {
        return DailyScheduleResponse.builder()
                .id(fixedSchedule.getId())
                .day(fixedSchedule.getDay())
                .time(new PeriodDTO<>(fixedSchedule.getStartTime(), fixedSchedule.getEndTime()))
                .event(toEventDTO(fixedSchedule))
                .build();
    }

    public static FixedSchedule toFixedScheduleEntity(PostNewScheduleRequest request, Facility facility, User admin) {
        return FixedSchedule.builder()
                .facility(facility)
                .reservationAdmin(admin)
                .startDate(request.getEffectiveDate().getStart())
                .endDate(request.getEffectiveDate().getEnd())
                .day(request.getDay())
                .startTime(request.getTime().getStart())
                .endTime(request.getTime().getEnd())
                .eventTitle(request.getEvent().getName())
                .hostUser(request.getEvent().getHostName())
                .outline(request.getEvent().getOutline())
                .purpose(request.getEvent().getPurpose())
                .build();
    }
}

package backend.spectrum.dguonoff.domain.admin.converter;

import backend.spectrum.dguonoff.DAO.Event;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.FixedSchedule;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import java.util.ArrayList;

public class FixedScheduleConverter {
    public static EventInfoDTO toEventDTO(FixedSchedule fixedSchedule) {
        Event event = fixedSchedule.getEvent();
        return EventInfoDTO.builder()
                .purpose(event.getPurpose())
                .outline(event.getOutline())
                .name(event.getName())
                .hostName(event.getHostName())
                .guestNumber(fixedSchedule.getGuestNumber())
                .build();
    }

    public static Event toEventEntity(EventInfoDTO eventInfoDTO) {
        return Event.builder()
                .name(eventInfoDTO.getName())
                .hostName(eventInfoDTO.getHostName())
                .purpose(eventInfoDTO.getPurpose())
                .outline(eventInfoDTO.getOutline())
                .reservations(new ArrayList<>())
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
                .guestNumber(request.getEvent().getGuestNumber())
                .facility(facility)
                .reservationAdmin(admin)
                .startDate(request.getEffectiveDate().getStart())
                .endDate(request.getEffectiveDate().getEnd())
                .day(request.getDay())
                .startTime(request.getTime().getStart())
                .endTime(request.getTime().getEnd())
                .event(toEventEntity(request.getEvent()))
                .build();
    }
    public static FixedSchedule toFixedScheduleEntity(PostNewScheduleRequest request, Facility facility, Event event) {
        return FixedSchedule.builder()
                .guestNumber(request.getEvent().getGuestNumber())
                .facility(facility)
                .startDate(request.getEffectiveDate().getStart())
                .endDate(request.getEffectiveDate().getEnd())
                .day(request.getDay())
                .startTime(request.getTime().getStart())
                .endTime(request.getTime().getEnd())
                .event(event)
                .build();
    }
}

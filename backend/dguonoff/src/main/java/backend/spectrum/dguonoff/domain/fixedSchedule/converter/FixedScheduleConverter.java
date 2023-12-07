package backend.spectrum.dguonoff.domain.fixedSchedule.converter;

import backend.spectrum.dguonoff.dao.Event;
import backend.spectrum.dguonoff.dao.Facility;
import backend.spectrum.dguonoff.dao.FixedSchedule;
import backend.spectrum.dguonoff.dao.User;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.common.PeriodDTO;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
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

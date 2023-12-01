package backend.spectrum.dguonoff.domain.admin.service;

import backend.spectrum.dguonoff.DAO.model.ReservationStatus;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import backend.spectrum.dguonoff.event.ReservationConfirmEvent;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * test 용도 서비스로 예약처리 서비스가 들어오면
 * event, email 관련 부분만 뽑아 사용하면 됨
 */
@Service
@RequiredArgsConstructor
public class ReservationHandlingService {
    private final ApplicationEventPublisher eventPublisher;

    public void approveReservation(Long reservationId) {
        /* mock data, 여기에 예약 정보를 확인 하는 등등의 절차가 필요함 */

        // 예약 처리 이벤트 발생
        ReservationConfirmEvent event = new ReservationConfirmEvent("학생회관", "101",
                LocalDate.now(),
                new PeriodDTO<LocalTime>(LocalTime.now(), LocalTime.now().plusMinutes(30)),
                ReservationStatus.APPROVED
        );
        eventPublisher.publishEvent(event);
    }
}

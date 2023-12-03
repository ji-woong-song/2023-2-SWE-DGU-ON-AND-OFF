package backend.spectrum.dguonoff.domain.reservation.dto.constraint;

import backend.spectrum.dguonoff.DAO.model.ReservationPeriod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MaxReservationConstraint { //시설 최대 예약 제약 조건
    private int max_reservation; //최대 예약 가능 횟수
    private ReservationPeriod max_reservation_period; //기준 기간
    private String category; //시설 종류


}

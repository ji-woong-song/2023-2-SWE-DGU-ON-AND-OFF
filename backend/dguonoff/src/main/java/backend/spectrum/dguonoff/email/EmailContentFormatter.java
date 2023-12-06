package backend.spectrum.dguonoff.email;

import backend.spectrum.dguonoff.dao.model.ReservationStatus;
import backend.spectrum.dguonoff.email.content.EmailMessage;
import backend.spectrum.dguonoff.event.ReservationConfirmEvent;
import java.time.format.DateTimeFormatter;

public class EmailContentFormatter {
    // 예약 이벤트에서 값을 가져와 사용자가 볼 이메일 본문 형태로 변환
    public static EmailMessage fromReservationEvent(ReservationConfirmEvent event) {
        // 상태에 따라 결과 메시지 변경, 다른 클래스에서 하는게 나아보이지만,
        // 일단 임시적으로 구현함
        ReservationStatus status = event.getStatus();
        String resultMessage;
        switch (status) {
            case APPROVED:
                resultMessage = "승인";
                break;
            case REJECTED:
                resultMessage = "거절";
                break;
            default:
                resultMessage = "오류";
                break;
        }
        // 본문 형식 만들어줌
        StringBuilder contentBuilder = new StringBuilder();
        // 시간 형식
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        contentBuilder
                .append("\n[날짜] : ")
                .append(event.getDate().toString()).append("\n")
                .append("\n[사용 시간] : ")
                .append(event.getPeriod().getStart().format(timeFormatter)).append(" ~ ")
                .append(event.getPeriod().getEnd().format(timeFormatter)).append("\n")
                .append("\n[사용 시설물] : ")
                .append(event.getBuildingName()).append(" ").append(event.getFacilityName()).append("\n")
                .append("\n[신청 결과] : ")
                .append(resultMessage);

        return EmailMessage.builder()
                .to(event.getToEmail())
                .subject("예약 신청 결과")
                .message(contentBuilder.toString())
                .build();
    }
}

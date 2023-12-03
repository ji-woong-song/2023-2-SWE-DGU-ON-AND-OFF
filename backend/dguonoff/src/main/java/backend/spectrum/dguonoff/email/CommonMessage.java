package backend.spectrum.dguonoff.email;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum CommonMessage {
    APPROVE_RESERVATION("예약 승인", "예약이 승인되었습니다."),
    REJECT_RESERVATION("예약 거절", "예약이 거절되었습니다."),
    ;

    private final String title;
    private final String message;
}

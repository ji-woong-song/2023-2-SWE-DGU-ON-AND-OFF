package backend.spectrum.dguonoff.global.statusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum CommonCode {
    //User
    SUCCESS_EMPOWERMENT(HttpStatus.OK, "%s 계정에 관리자 권한이 부여됐습니다."),
    SUCCESS_DEPRIVATION(HttpStatus.OK, "%s 계정에 관리자 권한이 박탈됐습니다."),

    //Reservation
    AVAILABLE_FACILITY(HttpStatus.OK, "예약 가능한 시설입니다."),
    SUCCESS_RESERVATION(HttpStatus.OK, "예약 신청이 완료되었습니다."),
    SUCCESS_MODIFICATION(HttpStatus.OK, "예약 수정이 완료되었습니다."),
    SUCCESS_DELETION(HttpStatus.OK, "예약 삭제가 완료되었습니다."),



    ;
    private final HttpStatus status;
    private final String message;

}

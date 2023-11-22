package backend.spectrum.dguonoff.global.statusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum CommonCode {
    //User
    SUCCESS_EMPOWERMENT(HttpStatus.OK, "%d 계정에 관리자 권한이 부여됐습니다."),

    ;
    private final HttpStatus status;
    private final String message;

}

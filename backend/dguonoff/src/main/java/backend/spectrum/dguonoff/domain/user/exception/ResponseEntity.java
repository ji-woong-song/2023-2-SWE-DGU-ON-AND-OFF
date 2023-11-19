package backend.spectrum.dguonoff.domain.user.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum ResponseEntity {
    NOT_EXIST_USER(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다."),
    NOT_EXIST_MASTER_ADMIN(HttpStatus.NOT_FOUND, "존재하지 않는 마스터 관리자입니다."),
    NO_AUTH(HttpStatus.FORBIDDEN, "권한이 없는 유저입니다."),
    SUCCESS_EMPOWERMENT(HttpStatus.OK, "%d 계정에 관리자 권한이 부여됐습니다."),
    ;
    private final HttpStatus status;
    private final String message;
}
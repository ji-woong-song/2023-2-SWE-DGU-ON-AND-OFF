package backend.spectrum.dguonoff.global.statusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum ErrorCode {

    //User
    NOT_EXIST_USER(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다."),
    NOT_EXIST_MASTER_ADMIN(HttpStatus.NOT_FOUND, "존재하지 않는 마스터 관리자입니다."),
    NO_AUTH(HttpStatus.FORBIDDEN, "권한이 없는 유저입니다."),


    //Common
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 메소드입니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러가 발생하였습니다."),
    ;

    private final HttpStatus status;
    private final String message;

}
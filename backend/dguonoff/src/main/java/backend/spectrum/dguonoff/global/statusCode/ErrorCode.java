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

    USER_ID_DUPLICATE(HttpStatus.NOT_ACCEPTABLE, "id가 중복되었습니다."),
    USER_PASSWORD_NOT_MATCHED(HttpStatus.NOT_ACCEPTABLE, "비밀번호가 틀렸습니다."),

    //Common
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 메소드입니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러가 발생하였습니다."),

    // Facility
    NOT_EXIST_FACILITY(HttpStatus.NOT_FOUND, "해당 시설물을 찾을 수 없습니다."),

    // Reservation
    EXIST_OVERLAPPED_INTERVAL(HttpStatus.CONFLICT, "겹치는 기간이 있습니다."),

    //Jwt
    JWT_EXPIRED(HttpStatus.FORBIDDEN, "JWT 토큰이 만료되었습니다."),
    JWT_INVALID_SIGNATURE(HttpStatus.FORBIDDEN, "JWT 시그니처가 잘못되었습니다."),
    JWT_MALFORMED(HttpStatus.FORBIDDEN,"JWT 토큰이 유효하지 않습니다."),
    JWT_UNSUPPORTED(HttpStatus.FORBIDDEN, "지원하지 않는 JWT 토큰 형식입니다."),
    ;

    private final HttpStatus status;
    private final String message;

}
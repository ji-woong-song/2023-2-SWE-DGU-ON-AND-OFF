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
    NOT_EXIST_ADMIN(HttpStatus.NOT_FOUND, "존재하지 않는 관리자입니다."),
    NOT_EXIST_MASTER_ADMIN(HttpStatus.NOT_FOUND, "존재하지 않는 마스터 관리자입니다."),
    NO_AUTH(HttpStatus.FORBIDDEN, "권한이 없는 유저입니다."),

    // Board
    NOT_EXIST_BOARD(HttpStatus.NOT_FOUND, "존재하지 않은 게시판입니다."),
    NOT_ALLOW_AUTHOR(HttpStatus.FORBIDDEN, "작성자 또는 관리자만 삭제할 수 있습니다"),

    DUP_BOOKMARK(HttpStatus.CONFLICT, "이미 등록한 시설물입니다"),
    NO_BOOKMARK(HttpStatus.NOT_FOUND, "등록되지 않은 북마크입니다."),

    USER_ID_DUPLICATE(HttpStatus.NOT_ACCEPTABLE, "id가 중복되었습니다."),
    USER_PASSWORD_NOT_MATCHED(HttpStatus.NOT_ACCEPTABLE, "비밀번호가 틀렸습니다."),

    //Common
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 메소드입니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러가 발생하였습니다."),

    // Facility
    NOT_EXIST_FACILITY(HttpStatus.NOT_FOUND, "해당 시설물을 찾을 수 없습니다."),
    NOT_DEFINED_RESERVATION_PERIOD(HttpStatus.NOT_FOUND, "정의되지 않은 기준 예약 기간입니다."),
    NEXT_RESERVATION_NOT_EXIST_FACILITY(HttpStatus.NOT_FOUND, "해당 시설물에 다음 예약이 존재하지 않습니다."),

    // Reservation
    NOT_EXIST_RESERVATION(HttpStatus.NOT_FOUND, "존재하지 않는 예약입니다."),
    NOT_MODIFIABLE_RESERVATION(HttpStatus.NOT_ACCEPTABLE, "수정할 수 없는 예약입니다."),
    NOT_DELETABLE_RESERVATION(HttpStatus.NOT_ACCEPTABLE, "삭제할 수 없는 예약입니다."),
    EXCEED_MAX_RESERVATION(HttpStatus.NOT_ACCEPTABLE, "최대 예약 횟수를 초과하였습니다."),
    EXIST_OVERLAPPED_INTERVAL(HttpStatus.CONFLICT, "겹치는 기간이 있습니다."),
    EXCEED_MAX_USAGE_TIME(HttpStatus.NOT_ACCEPTABLE, "이용시간이 최대 이용 시간을 초과하였습니다."),
    EXCEED_MAX_PERSONNEL(HttpStatus.NOT_ACCEPTABLE, "이용자 수가 최대 수용 인원을 초과하였습니다."),
    UNDER_MIN_PERSONNEL(HttpStatus.NOT_ACCEPTABLE, "이용자 수가 최소 인원보다 적습니다."),
    TIME_CONFLICT(HttpStatus.NOT_ACCEPTABLE, "시간이 겹치는 예약이 존재합니다."),
    INVALID_ORDER_TIME(HttpStatus.NOT_ACCEPTABLE, "시작 시간이 종료 시간보다 이전입니다."),
    INVALID_SAME_TIME(HttpStatus.NOT_ACCEPTABLE, "시작 시간과 종료 시간이 같습니다."),
    INVALID_RESERVATION_DATE(HttpStatus.NOT_ACCEPTABLE, "예약 가능한 날짜가 아닙니다."),
    NOT_BOOKABLE_FACILITY(HttpStatus.NOT_ACCEPTABLE, "예약 불가능한 시설입니다."),

    // FixedSchedule
    NOT_EXIST_SCHEDULE(HttpStatus.NOT_FOUND, "원하는 고정시간표가 없습니다"),

    //Jwt
    JWT_EXPIRED(HttpStatus.FORBIDDEN, "JWT 토큰이 만료되었습니다."),
    JWT_INVALID_SIGNATURE(HttpStatus.FORBIDDEN, "JWT 시그니처가 잘못되었습니다."),
    JWT_MALFORMED(HttpStatus.FORBIDDEN,"JWT 토큰이 유효하지 않습니다."),
    JWT_UNSUPPORTED(HttpStatus.FORBIDDEN, "지원하지 않는 JWT 토큰 형식입니다."),
    ;

    private final HttpStatus status;
    private final String message;

}
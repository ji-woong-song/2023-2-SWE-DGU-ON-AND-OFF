package backend.spectrum.dguonoff.global.error;

import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    //지원하지 않는 HTTP method 요청이 왔을 때 발생
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("[Error]: handle HttpRequestMethodNotSupportedException", e);
        ErrorResponse response = new ErrorResponse(ErrorCode.SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    //비즈리스 로직 관련 예외 처리
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ErrorResponse> handleBusinessException(final BusinessException e) {
        log.error("[Error]: handle BusinessException", e);
        ErrorResponse response = new ErrorResponse(e.getErrorCode());
        HttpStatus errorStatus = e.getErrorCode().getStatus();
        return new ResponseEntity<>(response, errorStatus);
    }

    //그 외 모든 예외 처리
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("[Error]: unexpected error occurred", e);
        ErrorResponse response = new ErrorResponse(ErrorCode.SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

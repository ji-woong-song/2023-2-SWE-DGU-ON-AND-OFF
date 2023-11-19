package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.dto.EmpowermentParams;
import backend.spectrum.dguonoff.domain.user.exception.AdminUserNotFoundException;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static backend.spectrum.dguonoff.domain.user.exception.ResponseEntity.SUCCESS_EMPOWERMENT;

@Controller
@Slf4j
@RequestMapping("/admin/master")
@RequiredArgsConstructor
public class MasterAdminController {

    private final UserService userService;

    @PostMapping("/empowerment")
    public ResponseEntity<String> grantAdminAuthority(@RequestBody EmpowermentParams empParams){
    Long adminId = empParams.getAdminId();
    Long userId = empParams.getUserId();

    try {
        userService.checkMasterAdmin(adminId);
        User targetUser = userService.findUser(userId);
        userService.changeRoleToAdmin(targetUser);

    } catch (AdminUserNotFoundException e) {
        log.error(e.getMessage());
        return new ResponseEntity(e.getMessage(), e.getStatus());

    } catch (UserNotFoundException e) {
        log.error(e.getMessage());
        return new ResponseEntity(e.getMessage(), e.getStatus());
    }

    String successMessage = String.format(SUCCESS_EMPOWERMENT.getMessage(), userId);
    HttpStatus successStatus = SUCCESS_EMPOWERMENT.getStatus();

    return new ResponseEntity(successMessage, successStatus);
    }
}

package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.user.dto.EmpowermentParams;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_EMPOWERMENT;

@Controller
@Slf4j
@RequestMapping("/admin/master")
@RequiredArgsConstructor
public class MasterAdminController {

    private final UserService userService;

    //관리자 권한 부여 기능
    @PostMapping("/empowerment")
    public ResponseEntity<String> grantAdminAuthority(@RequestBody EmpowermentParams empParams){
        Long adminId = empParams.getAdminId();
        Long userId = empParams.getUserId();

        userService.checkMasterAdmin(adminId);
        User targetUser = userService.findUser(userId);
        userService.changeRoleToAdmin(targetUser);

        String successMessage = String.format(SUCCESS_EMPOWERMENT.getMessage(), userId);
        HttpStatus successStatus = SUCCESS_EMPOWERMENT.getStatus();

        return new ResponseEntity(successMessage, successStatus);
    }
}

package backend.spectrum.dguonoff.Service;

import backend.spectrum.dguonoff.domain.user.entity.Role;
import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.exception.InvalidAccessException;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    private User userA;
    private User masterA;

    @BeforeEach
    void setUp() { // 테스트에 필요한 초기 데이터를 설정
        userA = new User(100L, "1234", Role.NORMAL, "userA", "CSE", "user@test.com");
        masterA = new User(200L, "1234", Role.MASTER, "MasterA", "CSE", "master@test.com");

        userRepository.save(userA);
        userRepository.save(masterA);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @DisplayName("존재하는 아이디로 조회하면 그 유저를 조회할 수 있다.")
    @Test
    public void 존재하는_유저조회() {
        Long checkId = 100L;
        User findUser = userService.findUser(checkId);

        assertThat(findUser.getName()).isEqualTo(userA.getName());
    }

    @DisplayName("존재하지 않는 아이디로 조회하면 예외가 발생한다.")
    @Test
    public void 존재하지_않는_유저조회() {
        Long notExistUserId = 101L;

        assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(() -> {
            userService.findUser(notExistUserId);
        }).withMessage("존재하지 않는 유저입니다.");

    }

    @DisplayName("마스터 관리자 아이디로 권한 확인하면 관리자 권한이 있는지 확인할 수 있다.")
    @Test
    public void 마스터_관리자_권한_확인() {
        Long checkId = 200L;

        assertThatCode(() -> {
            userService.checkMasterAdmin(checkId);
        }).doesNotThrowAnyException();
    }

    @DisplayName("존재하지 않는 아이디로 권한 확인하면 예외가 발생한다.")
    @Test
    public void 존재하지_않는_아이디_권한_확인() {
        Long checkId = 300L;

        assertThatExceptionOfType(UserNotFoundException.class).isThrownBy(() -> {
            userService.checkMasterAdmin(checkId);
        }).withMessage("존재하지 않는 마스터 관리자입니다.");
    }

    @DisplayName("관리자가 아닌 아이디로 권한 확인하면 예외가 발생한다.")
    @Test
    public void 마스터_관리자_아닌_아이디로_권한_확인() {
        Long checkId = 100L;

        assertThatExceptionOfType(InvalidAccessException.class).isThrownBy(() -> {
            userService.checkMasterAdmin(checkId);
        }).withMessage("권한이 없는 유저입니다. MASTER 권한이 필요합니다.");
    }

    @DisplayName("유저에게 권한을 부여하면 역할이 ADMIN이 된다.")
    @Test
    public void 유저_권한_부여() {
        userService.changeRoleToAdmin(userA);
        User newAdmin = userService.findUser(userA.getId());
        assertThat(newAdmin.getRole()).isEqualTo(Role.ADMIN);
    }




}

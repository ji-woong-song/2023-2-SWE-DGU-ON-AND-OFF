package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.entity.Role;
import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.exception.InvalidAccessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //유저 조회 함수
    public User findUser(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));

        return user;
    }

    //마스터 관리자 조회 및 권한 확인 함수
    public void checkMasterAdmin(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_MASTER_ADMIN));
        Role userRole = user.getRole();
        if(!userRole.equals(Role.MASTER)){
            throw new InvalidAccessException(ErrorCode.NO_AUTH, Role.MASTER);
        }
    }

    //관리자 권한 부여 함수
    public void changeRoleToAdmin(User targetUser) {
        userRepository.changeRoleToAdmin(targetUser.getId());
    }
}

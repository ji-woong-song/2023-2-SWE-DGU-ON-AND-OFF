package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.dao.User;
import backend.spectrum.dguonoff.dao.model.Role;
import backend.spectrum.dguonoff.domain.user.dto.UserInfoDTO;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static backend.spectrum.dguonoff.dao.model.Role.ADMIN;
import static backend.spectrum.dguonoff.dao.model.Role.MASTER;
import static backend.spectrum.dguonoff.global.statusCode.ErrorCode.NOT_EXIST_ADMIN;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //유저 조회 함수
    public User findUser(String userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));

        return user;
    }

    //관리자 권한 부여 함수
    public void changeRoleToAdmin(User targetUser) {
        userRepository.changeRoleToAdmin(targetUser.getId());
    }

    //관리자 권한 확인 함수
    public void checkAdmin(String adminId) {
        User user = userRepository
                .findById(adminId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        Role userRole = user.getRole();
        if (!userRole.equals(ADMIN) && !userRole.equals(MASTER)) {
            throw new UserNotFoundException(NOT_EXIST_ADMIN);
        }
    }

    // 모든 유저 정보 얻어오는 메서드
    public List<UserInfoDTO> getAllUsers() {
        List<User> all = userRepository.findAll();
        return all.stream()
                .map(user-> UserInfoDTO.builder()
                    .sid(user.getSid())
                    .id(user.getId())
                    .major(user.getMajor())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build())
                .collect(Collectors.toList());
    }

    public void changeRoleToNormal(User targetUser) {
        userRepository.changeRoleToNormal(targetUser.getId());
    }
}

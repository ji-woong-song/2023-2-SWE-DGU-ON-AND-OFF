package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.domain.Role;
import backend.spectrum.dguonoff.domain.user.domain.User;
import backend.spectrum.dguonoff.domain.user.exception.AdminUserNotFoundException;
import backend.spectrum.dguonoff.domain.user.exception.ResponseEntity;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findUser(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ResponseEntity.NOT_EXIST_USER));

        return user;
    }

    public void checkMasterAdmin(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new AdminUserNotFoundException(ResponseEntity.NOT_EXIST_MASTER_ADMIN));
        if(!user.getRole().equals(Role.MASTER)){
            throw new AdminUserNotFoundException(ResponseEntity.NO_AUTH);
        }
    }

    public void changeRoleToAdmin(User targetUser) {
        userRepository.changeRoleToAdmin(targetUser.getId());
    }
}

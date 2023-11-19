package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<AllUserResponse> findAllUsers() {
        AllUserResponse allUser = userService.getAllUser();
        return ResponseEntity.ok(allUser);
    }
}

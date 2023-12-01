package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.admin.dto.common.FacilityKeyDTO;
import backend.spectrum.dguonoff.domain.user.service.UserBookmarkService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * User 정보를 찾거나 수정하는 api
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserBookmarkService userBookmarkService;

    @PostMapping("/bookmark")
    public ResponseEntity<String> enrollBookmark(Principal principal, @RequestBody FacilityKeyDTO request) {
        this.userBookmarkService.enrollBookmark(principal.getName(), request);
        return ResponseEntity.ok("등록 성공");
    }

    @DeleteMapping("/bookmark")
    public ResponseEntity<String> removeBookmark(Principal principal, @RequestBody FacilityKeyDTO request) {
        this.userBookmarkService.removeBookmark(principal.getName(), request);
        return ResponseEntity.ok("삭제 성공");
    }
}

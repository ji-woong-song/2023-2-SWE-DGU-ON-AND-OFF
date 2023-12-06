package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.admin.dto.common.FacilityKeyDTO;
import backend.spectrum.dguonoff.domain.user.dto.UserBookmarkDTO;
import backend.spectrum.dguonoff.domain.user.service.UserBookmarkService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * User 정보를 찾거나 수정하는 api
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserBookmarkService userBookmarkService;
    @GetMapping("/bookmark")
    public ResponseEntity<List<UserBookmarkDTO>> getBookmarks(Principal principal) {
        List<UserBookmarkDTO> userBookmarks = this.userBookmarkService.getUserBookmarks(principal.getName());
        return ResponseEntity.ok(userBookmarks);
    }

    @PostMapping("/bookmark")
    public ResponseEntity<String> enrollBookmark(Principal principal, @RequestBody FacilityKeyDTO request) {
        this.userBookmarkService.enrollBookmark(principal.getName(), request);
        return ResponseEntity.ok("등록 성공");
    }

    @DeleteMapping("/bookmark/{buildingName}/{facilityCode}")
    public ResponseEntity<String> removeBookmark(Principal principal, @PathVariable String buildingName, @PathVariable String facilityCode) {
        FacilityKeyDTO request = new FacilityKeyDTO(facilityCode, buildingName);
        this.userBookmarkService.removeBookmark(principal.getName(), request);
        return ResponseEntity.ok("삭제 성공");
    }
}

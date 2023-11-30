package backend.spectrum.dguonoff.domain.admin.api;

import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.service.FixedScheduleService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fixedSchedules")
public class FixedScheduleController {
    private final FixedScheduleService fixedScheduleService;

    @GetMapping("/")
    public ResponseEntity<List<DailyScheduleResponse>> getFixedSchedules(@RequestParam DailyScheduleRequest request) {
        List<DailyScheduleResponse> fixedSchedules = fixedScheduleService.getFixedTimeTables(request);
        return ResponseEntity.ok(fixedSchedules);
    }

    @PostMapping("/")
    public ResponseEntity<PostNewScheduleResponse> enrollFixedSchedule(
            Principal principal,
            @RequestBody PostNewScheduleRequest request
    ) {
        PostNewScheduleResponse response = fixedScheduleService.enrollFixedTimeTable(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> deleteAllFixedSchedule(@PathVariable Long scheduleId) {
        String success = this.fixedScheduleService.removeSchedule(scheduleId);
        return ResponseEntity.ok(success);
    }
}

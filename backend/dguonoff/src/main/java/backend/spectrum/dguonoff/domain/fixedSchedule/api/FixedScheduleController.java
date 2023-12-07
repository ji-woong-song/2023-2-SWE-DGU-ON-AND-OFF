package backend.spectrum.dguonoff.domain.fixedSchedule.api;


import backend.spectrum.dguonoff.domain.fixedSchedule.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.PostNewScheduleResponse;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.UpdateScheduleRequest;
import backend.spectrum.dguonoff.domain.fixedSchedule.dto.UpdateScheduleResponse;
import backend.spectrum.dguonoff.domain.fixedSchedule.service.FixedScheduleService;
import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/fixedSchedules")
public class FixedScheduleController {
    private final FixedScheduleService fixedScheduleService;

    @GetMapping("/")
    public ResponseEntity<List<DailyScheduleResponse>> getFixedSchedules(
            @RequestParam DayOfWeek day,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam String code, @RequestParam String buildingName
    ) {
        List<DailyScheduleResponse> fixedSchedules = fixedScheduleService.getFixedTimeTables(day, startDate, endDate,
                code, buildingName);
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
    @PatchMapping("/")
    public ResponseEntity<UpdateScheduleResponse> updateFixedSchedule(
            @RequestBody UpdateScheduleRequest fixedSchedule) {
        UpdateScheduleResponse result = this.fixedScheduleService.updateSchedule(fixedSchedule);
        return ResponseEntity.ok(result);
    }
}

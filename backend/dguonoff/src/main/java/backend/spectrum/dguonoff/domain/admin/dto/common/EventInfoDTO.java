package backend.spectrum.dguonoff.domain.admin.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class EventInfoDTO {
    private String name;
    private String hostName;
    private String outline;
    private String purpose;
    private Integer guestNumber;
}

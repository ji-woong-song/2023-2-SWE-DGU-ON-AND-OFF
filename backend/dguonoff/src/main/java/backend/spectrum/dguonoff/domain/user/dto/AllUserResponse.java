package backend.spectrum.dguonoff.domain.user.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AllUserResponse {
    List<String> names;
}

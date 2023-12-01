package backend.spectrum.dguonoff.domain.facility.dto;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FacilityOutlineDTO {
    private String name;
    private String code;
    private Boolean bookmarked;
    private FacilityStatus status;
    private Integer capacity;

    public void setBookmarked(Boolean bookmarked) {
        this.bookmarked = bookmarked;
    }
}

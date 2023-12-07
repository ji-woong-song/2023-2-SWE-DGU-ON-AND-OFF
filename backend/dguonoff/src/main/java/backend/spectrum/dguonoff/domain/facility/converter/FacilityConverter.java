package backend.spectrum.dguonoff.domain.facility.converter;

import backend.spectrum.dguonoff.dao.Facility;
import backend.spectrum.dguonoff.domain.facility.dto.FacilityOutlineDTO;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FacilityConverter {
    public static FacilityOutlineDTO toFacilityOutlineDTO(Facility facility) {
        return FacilityOutlineDTO.builder()
                .code(facility.getCode())
                .bookmarked(false)
                .status(facility.getState())
                .name(facility.getName())
                .capacity(facility.getCapacity())
                .build();
    }
}

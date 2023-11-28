package backend.spectrum.dguonoff.DAO.idClass;

import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BookmarkId implements Serializable {
    private String userId;
    private FacilityPK facilityId;
}

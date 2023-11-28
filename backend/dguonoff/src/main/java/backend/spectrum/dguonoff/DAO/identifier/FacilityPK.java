package backend.spectrum.dguonoff.DAO.identifier;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Embeddable
@EqualsAndHashCode
public class FacilityPK implements Serializable{
    private String buildingName;

    @Column(name = "id", nullable = false)
    private String facilityId;
}

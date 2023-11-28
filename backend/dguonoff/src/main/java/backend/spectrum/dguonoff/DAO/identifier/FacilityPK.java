package backend.spectrum.dguonoff.DAO.identifier;

import backend.spectrum.dguonoff.DAO.Building;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Embeddable
public class FacilityPK implements Serializable {
    private String buildingName;

    @Column(name = "id", nullable = false)
    private String facilityId;
}

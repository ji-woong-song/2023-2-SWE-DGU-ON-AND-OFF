package backend.spectrum.dguonoff.DAO.idClass;

import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalTime;
import java.time.DayOfWeek;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class FixedTimeId implements Serializable {
    @Column(nullable = false, insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

    @Column(nullable = false, insertable = false, updatable = false)
    private LocalTime startTime;

    @Column(nullable = false, insertable = false, updatable = false)
    private LocalTime endTime;
    private FacilityPK facilityId;
}
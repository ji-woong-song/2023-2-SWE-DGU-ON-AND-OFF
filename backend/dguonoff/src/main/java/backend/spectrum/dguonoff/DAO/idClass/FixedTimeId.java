package backend.spectrum.dguonoff.DAO.idClass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FixedTimeId implements Serializable {
    private DayOfWeek day;
    private LocalTime startTime;
    private LocalTime endTime;
    private String facilityId;

}
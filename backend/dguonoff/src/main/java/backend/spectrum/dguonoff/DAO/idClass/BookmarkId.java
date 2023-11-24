package backend.spectrum.dguonoff.DAO.idClass;

import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkId implements Serializable {
    private String userId;
    private String facilityId;
}

package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.idClass.BookmarkId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "Bookmark")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bookmark {

    @EmbeddedId
    private BookmarkId bookmarkId;

    @MapsId("userId")
    @ManyToOne(fetch = LAZY)
    private User userId;

    @MapsId("facilityId")
    @ManyToOne(fetch = LAZY)
    private Facility facilityId;

    public Bookmark(User user, Facility facility) {
        this.bookmarkId = new BookmarkId(userId.getId(), facilityId.getId());
        this.userId = user;
        this.facilityId = facility;
    }
}

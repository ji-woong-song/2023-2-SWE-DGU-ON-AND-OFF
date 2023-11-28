package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Facility")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Facility {

    @EmbeddedId
    private FacilityPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @MapsId("buildingName")
    private Building building;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(15) DEFAULT 'EMPTY'")
    private FacilityStatus state;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "capacity",nullable = false)
    private int capacity;

    @Column(name = "floor")
    private Integer floor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private FacilityCategory category;

    @OneToMany(mappedBy = "facility")
    private List<Reservation> reservations = new ArrayList<>();

    @Column(name = "isBookable", columnDefinition = "BOOLEAN default FALSE")
    private Boolean isBookable;
}

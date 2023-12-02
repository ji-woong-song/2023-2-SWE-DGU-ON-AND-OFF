package backend.spectrum.dguonoff.DAO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Building")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Building {
    @Id
    @Column(name = "name", nullable = false)
    private String name;

    @Column(nullable = false)
    private int maxFloor;

    @OneToMany(mappedBy = "building")
    private List<Facility> facilities = new ArrayList<>();
}

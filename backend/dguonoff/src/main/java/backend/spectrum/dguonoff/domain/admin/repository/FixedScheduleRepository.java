package backend.spectrum.dguonoff.domain.admin.repository;


import backend.spectrum.dguonoff.DAO.FixedSchedule;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedScheduleRepository extends JpaRepository<FixedSchedule, Long> {
    List<FixedSchedule> findByDayAndStartDateBetweenAndFacility_Building_NameAndFacility_Id(
            DayOfWeek day, LocalDate inputStartDate, LocalDate inputEndDate,
            String buildingName, String facilityId
    );
}

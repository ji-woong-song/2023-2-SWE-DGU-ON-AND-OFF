package backend.spectrum.dguonoff.domain.user.repository;

import backend.spectrum.dguonoff.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Transactional
    @Modifying
    @Query("update User u set u.role = 'ADMIN' where u.id = ?1")
    int changeRoleToAdmin(@NonNull Long id);

}

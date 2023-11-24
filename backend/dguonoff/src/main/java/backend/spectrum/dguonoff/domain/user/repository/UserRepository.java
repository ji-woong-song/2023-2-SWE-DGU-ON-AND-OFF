package backend.spectrum.dguonoff.domain.user.repository;

import backend.spectrum.dguonoff.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Transactional
    @Modifying
    @Query("update User u set u.role = 'ADMIN' where u.id = ?1")
    int changeRoleToAdmin(@NonNull String id);
}

package backend.spectrum.dguonoff.domain.user.repository;

import backend.spectrum.dguonoff.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}

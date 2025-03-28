package condosync.backend.repository;

import condosync.backend.model.Locais;
import condosync.backend.model.Moradores;
import condosync.backend.model.Reservas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservasRepository extends JpaRepository<Reservas, Long> {
    List<Reservas> findByMorador(Moradores morador);
    List<Reservas> findByLocal(Locais local);
    List<Reservas> findByData(LocalDate data);
}

package condosync.backend.dao;

import condosync.backend.model.Locais;
import condosync.backend.model.Moradores;
import condosync.backend.model.Reservas;
import condosync.backend.repository.ReservasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservasDAO {

    @Autowired
    private ReservasRepository reservasRepository;

    public Reservas inserirReserva(Reservas reserva) {
        return reservasRepository.save(reserva);
    }

    public Reservas atualizarReserva(Reservas reserva) {
        return reservasRepository.save(reserva);
    }

    void deletarReserva(Reservas reserva) {
        reservasRepository.delete(reserva);
    }

    public List<Reservas> listarReservas() {
        return reservasRepository.findAll();
    }

    public Reservas buscarReservaPorId(Long id) {
        return reservasRepository.findById(id).orElse(null);
    }

    public List<Reservas> buscarReservaPorData(LocalDate data) {
        return reservasRepository.findByData(data);
    }

    public List<Reservas> buscarReservaPorMorador(Moradores morador) {
        return reservasRepository.findByMorador(morador);
    }

    public List<Reservas> buscarReservaPorLocal(Locais local) {
        return reservasRepository.findByLocal(local);
    }
}

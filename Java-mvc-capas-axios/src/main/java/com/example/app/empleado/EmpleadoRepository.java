package com.example.app.empleado;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    List<Empleado> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByEmail(String email);
}
package com.example.app.usuario;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return usuarioRepository.findByLogin(request.getLogin())
                .map(usuario -> {
                    if (usuario.getClave().equals(request.getClave())) {
                        return ResponseEntity.ok(Map.of(
                                "id", usuario.getId(),
                                "nombre", usuario.getNombre(),
                                "login", usuario.getLogin()
                        ));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("mensaje", "Credenciales inválidas"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("mensaje", "Usuario no encontrado")));
    }
}
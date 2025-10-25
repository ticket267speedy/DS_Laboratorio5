package com.example.app.usuario;

import lombok.Data;

@Data
public class AuthRequest {
    private String login;
    private String clave;
}
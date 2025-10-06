package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;

public class LoginRequest {

    @SerializedName("correo") // Cambiar a "email" si tu backend espera "email"
    private String correo;

    @SerializedName("password")
    private String password;

    public LoginRequest(String correo, String password) {
        this.correo = correo;
        this.password = password;
    }

    // Getters opcionales
    public String getCorreo() {
        return correo;
    }

    public String getPassword() {
        return password;
    }
}

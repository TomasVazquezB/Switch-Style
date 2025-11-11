package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;

public class RegisterRequest {
    @SerializedName("nombre")
    private String nombre;

    @SerializedName("correo")
    private String correo;

    @SerializedName("password")
    private String password;

    @SerializedName("tipo")
    private String tipo;

    public RegisterRequest(String nombre, String correo, String password, String tipo) {
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.tipo = tipo;
    }

    public String getNombre() { return nombre; }
    public String getCorreo() { return correo; }
    public String getPassword() { return password; }
    public String getTipo() { return tipo; }
}

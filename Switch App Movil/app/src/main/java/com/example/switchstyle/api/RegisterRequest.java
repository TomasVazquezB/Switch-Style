package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;
public class RegisterRequest {
    @SerializedName("Nombre")
    private String nombre;

    @SerializedName("Correo_Electronico")
    private String correo;

    @SerializedName("Contraseña")
    private String password;

    @SerializedName("Tipo_Usuario")
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
    public String getTipo() {return tipo;}
}
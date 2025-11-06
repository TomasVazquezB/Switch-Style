package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    private int id;

    @SerializedName(value = "nombre", alternate = {"Nombre"})
    private String nombre;

    @SerializedName(value = "apellido", alternate = {"Apellido"})
    private String apellido;

    @SerializedName(value = "correo", alternate = {"Correo_Electronico"})
    private String correo;

    @SerializedName(value = "rol", alternate = {"Tipo_Usuario"})
    private String rol;

    public int getId() { return id; }
    public String getNombre() { return nombre; }

    public String getApellido() {return apellido;}
    public String getCorreo() { return correo; }
    public String getRol() { return rol; }

    public void setId(int id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public void setApellido(String apellido) {this.apellido = apellido; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setRol(String rol) { this.rol = rol; }
}
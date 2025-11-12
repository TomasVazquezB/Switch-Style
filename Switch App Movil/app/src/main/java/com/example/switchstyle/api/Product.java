package com.example.switchstyle.api;

import com.google.gson.JsonElement;
import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Product {

    private int id;

    // Puede venir "nombre" o "titulo" según el endpoint
    @SerializedName(value = "nombre", alternate = {"titulo"})
    private String nombre;

    private String descripcion; // no se mostrará, pero se mantiene por compatibilidad
    private double precio; // idem
    private String estilo;

    @SerializedName("imagen_url")
    private String imagen_url;

    // Gson no fallará si viene un objeto
    private JsonElement categoria;
    private JsonElement usuario;

    private List<Imagen> imagenes;

    // === Getters usados por la app ===
    public int getId() {
        return id;
    }

    public String getNombre() {
        return nombre != null ? nombre : "";
    }

    public String getImagen_url() {
        return imagen_url;
    }

    public List<Imagen> getImagenes() {
        return imagenes;
    }

    // Los demás campos se ignoran completamente
}

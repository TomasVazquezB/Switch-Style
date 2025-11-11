package com.example.switchstyle.api;

import java.util.List;
public class Product {
    private int id;
    private String nombre;
    private String titulo;
    private String descripcion;
    private double precio;
    private String tipo;
    private String categoria;
    private String estilo;
    private String imagen_url;
    private List<String> imagenes;

    public int getId() {
        return id;
    }
    public String getNombre() {
     return nombre !=null?nombre :titulo;
}
    public String getDescripcion() { return descripcion; }
    public double getPrecio() { return precio; }
    public String getTipo() { return tipo; }
    public String getImagen_url() { return imagen_url; }
    public List<String> getImagenes() {return imagenes; }
}
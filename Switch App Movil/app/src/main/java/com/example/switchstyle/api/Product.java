package com.example.switchstyle.api;

import java.util.List;

public class Product {
    private int id;
    private String nombre;
    private String categoria;
    private boolean meGusta;
    private List<String> urlsImagenes;

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public boolean isMeGusta() { return meGusta; }
    public List<String> getUrlsImagenes() { return urlsImagenes; }

    public void setId(int id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public void setMeGusta(boolean meGusta) { this.meGusta = meGusta; }
    public void setUrlsImagenes(List<String> urlsImagenes) { this.urlsImagenes = urlsImagenes; }
}

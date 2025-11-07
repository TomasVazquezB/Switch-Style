package com.example.switchstyle;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.HashSet;
import java.util.Set;
public class FavoritosManager {
    private static final String PREF_NAME = "FavoritosPrefs";
    private static final String KEY_FAVORITOS = "favoritos";
    private final SharedPreferences prefs;
    public FavoritosManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }
    public void agregar(int id) {
        Set<String> favs = new HashSet<>(prefs.getStringSet(KEY_FAVORITOS, new HashSet<>()));
        favs.add(String.valueOf(id));
        prefs.edit().putStringSet(KEY_FAVORITOS, favs).apply();
    }
    public void quitar(int id) {
        Set<String> favs = new HashSet<>(prefs.getStringSet(KEY_FAVORITOS, new HashSet<>()));
        favs.remove(String.valueOf(id));
        prefs.edit().putStringSet(KEY_FAVORITOS, favs).apply();
    }
    public boolean esFavorito(int id) {
        Set<String> favs = prefs.getStringSet(KEY_FAVORITOS, new HashSet<>());
        return favs.contains(String.valueOf(id));
    }
    public Set<String> obtenerTodos() {
        return prefs.getStringSet(KEY_FAVORITOS, new HashSet<>());
    }
    public void limpiar() {
        prefs.edit().clear().apply();
    }
}
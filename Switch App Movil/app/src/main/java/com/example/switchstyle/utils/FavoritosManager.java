package com.example.switchstyle.utils;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;

public class FavoritosManager {
    private static final String PREF_NAME = "favoritos_pref";
    private static final String KEY_FAVORITOS = "favoritos";
    private final SharedPreferences prefs;

    public FavoritosManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public List<Integer> getFavoritos() {
        String json = prefs.getString(KEY_FAVORITOS, "[]");
        List<Integer> lista = new ArrayList<>();
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) lista.add(arr.getInt(i));
        } catch (Exception ignored) {}
        return lista;
    }

    public void agregar(int id) {
        List<Integer> lista = getFavoritos();
        if (!lista.contains(id)) lista.add(id);
        guardar(lista);
    }

    public void quitar(int id) {
        List<Integer> lista = getFavoritos();
        lista.remove(Integer.valueOf(id));
        guardar(lista);
    }

    public boolean esFavorito(int id) {
        return getFavoritos().contains(id);
    }

    private void guardar(List<Integer> lista) {
        JSONArray arr = new JSONArray(lista);
        prefs.edit().putString(KEY_FAVORITOS, arr.toString()).apply();
    }
}
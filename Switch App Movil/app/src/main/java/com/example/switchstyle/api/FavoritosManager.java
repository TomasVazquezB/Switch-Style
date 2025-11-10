package com.example.switchstyle.api;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.annotation.NonNull;

import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FavoritosManager {
    private static final String PREF_NAME = "FavoritosPrefs";
    private static final String KEY_FAVORITOS = "favoritos";

    private final SharedPreferences prefs;
    private final SessionManager session;
    private final ApiService apiService;

    public FavoritosManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        session = new SessionManager(context);
        apiService = RetrofitClient.getClient().create(ApiService.class);
    }

    // ✅ Obtener todos los favoritos (como localStorage)
    public Set<String> obtenerTodos() {
        return new HashSet<>(prefs.getStringSet(KEY_FAVORITOS, new HashSet<>()));
    }

    // ✅ Guardar favoritos en local
    public void guardar(int favs) {
        prefs.edit().putStringSet(KEY_FAVORITOS, favs).apply();
    }

    // ✅ Agregar o quitar producto del local
    public void toggleFavorito(int idProducto) {
        Set<String> favs = obtenerTodos();
        if (favs.contains(String.valueOf(idProducto))) {
            favs.remove(String.valueOf(idProducto));
        } else {
            favs.add(String.valueOf(idProducto));
        }
        guardar(favs);

        // 🔄 Sincronizar con backend solo si hay sesión activa
        if (session.isLoggedIn()) sincronizarConBackend(favs);
    }

    public boolean esFavorito(int idProducto) {
        return obtenerTodos().contains(String.valueOf(idProducto));
    }

    // 🔁 Sincronizar con Laravel Cloud (opcional)
    private void sincronizarConBackend(Set<String> favs) {
        List<Integer> lista = new ArrayList<>();
        for (String s : favs) lista.add(Integer.parseInt(s));

        Map<String, Object> data = Map.of("favoritos", lista);

        String token = "Bearer " + session.getToken();
        apiService.updateFavoritos(token, data).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(@NonNull Call<JsonObject> call, @NonNull Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    Log.d("FavoritosManager", "✅ Favoritos sincronizados con servidor");
                } else {
                    Log.e("FavoritosManager", "⚠️ Error al sincronizar favoritos: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<JsonObject> call, @NonNull Throwable t) {
                Log.e("FavoritosManager", "❌ Fallo de red al sincronizar: " + t.getMessage());
            }
        });
    }

    public void quitar(int id) {
    }
}

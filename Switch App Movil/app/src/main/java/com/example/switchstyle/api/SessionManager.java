package com.example.switchstyle.api;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "SwitchStylePrefs";
    private static final String KEY_TOKEN = "auth_token";
    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    // Guardar token de autenticación
    public void saveToken(String token) {
        editor.putString(KEY_TOKEN, token);
        editor.apply();
    }

    // Obtener token de autenticación
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    // Verificar si el usuario está logueado
    public boolean isLoggedIn() {
        return getToken() != null;
    }

    // Cerrar sesión y limpiar token
    public void logout() {
        editor.remove(KEY_TOKEN).apply();
    }

    // Limpiar toda la sesión (opcional)
    public void clearSession() {
        editor.clear().apply();
    }
}

package com.example.switchstyle.api;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private static final String PREF_NAME = "SwitchStylePrefs";
    private static final String KEY_TOKEN = "auth_token";

    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_NOMBRE = "user_nombre";
    private static final String KEY_USER_CORREO = "user_correo";
    private static final String KEY_USER_ROL = "user_rol";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    /** Guardar token de autenticación */
    public void saveToken(String token) {
        editor.putString(KEY_TOKEN, token);
        editor.apply();
    }

    /** Obtener token */
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    /** Verificar si hay sesión activa */
    public boolean isLoggedIn() {
        return getToken() != null;
    }

    /** Cerrar sesión (remover token y usuario) */
    public void logout() {
        editor.remove(KEY_TOKEN)
                .remove(KEY_USER_ID)
                .remove(KEY_USER_NOMBRE)
                .remove(KEY_USER_CORREO)
                .remove(KEY_USER_ROL)
                .apply();
    }

    /** Limpiar toda la sesión */
    public void clearSession() {
        editor.clear().apply();
    }

    /** Guardar datos del usuario */
    public void saveUser(User user) {
        if (user == null) return;
        editor.putInt(KEY_USER_ID, user.getId());
        editor.putString(KEY_USER_NOMBRE, user.getNombre());
        editor.putString(KEY_USER_CORREO, user.getCorreo());
        editor.putString(KEY_USER_ROL, user.getRol());
        editor.apply();
    }

    /** Obtener datos del usuario */
    public User getUser() {
        if (!isLoggedIn()) return null;
        User user = new User();
        user.setId(prefs.getInt(KEY_USER_ID, -1));
        user.setNombre(prefs.getString(KEY_USER_NOMBRE, null));
        user.setCorreo(prefs.getString(KEY_USER_CORREO, null));
        user.setRol(prefs.getString(KEY_USER_ROL, null));
        return user;
    }
}

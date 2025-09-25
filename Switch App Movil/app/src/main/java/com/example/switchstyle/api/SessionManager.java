package com.example.switchstyle.api;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "Switch Style";
    private static final String KEY_TOKEN = "auth_token";
    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    public void saveToken(String token) {
        editor.putString(KEY_TOKEN, token);
        editor.apply();
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    public boolean isLoggedIn() {
        return getToken() != null;
    }

    public void logout() {
        editor.remove(KEY_TOKEN).apply();
    }

    public void clearSession() {
        editor.clear().apply();
    }
}
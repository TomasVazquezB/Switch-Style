package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;

public class AuthResponse {
    @SerializedName("token")
    private String token;

    @SerializedName("message")
    private String message;

    @SerializedName("user")
    private User user;  // <-- Usamos la clase User externa

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }
}

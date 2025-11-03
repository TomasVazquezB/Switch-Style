package com.example.switchstyle.api;

import com.google.gson.annotations.SerializedName;

public class AuthResponse {

    @SerializedName("token")
    private String token;

    @SerializedName("message")
    private String message;

    @SerializedName("user") // 🔹 Coincide con tu backend
    private User user;

    public String getToken() { return token; }
    public String getMessage() { return message; }
    public User getUser() { return user; }
}

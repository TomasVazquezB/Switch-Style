package com.example.switchstyle.api;

import com.google.gson.JsonObject;
import java.util.List;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiService {

    @POST("api/mobile/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @POST("api/mobile/register")
    Call<AuthResponse> register(@Body RegisterRequest request);

    // 🔹 Ropa (sin token)
    @GET("api/ropa")
    Call<List<Product>> getRopa();

    // 🔹 Accesorios (sin token)
    @GET("api/accesorios")
    Call<List<Product>> getAccesorios();

    // 🔹 Sincronizar favoritos
    @POST("api/favoritos/update")
    Call<JsonObject> updateFavoritos(
            @Header("Authorization") String token,
            @Body Map<String, Object> data
    );
}

package com.example.switchstyle.api;

import com.google.gson.JsonObject;
import java.util.List;
import java.util.Map;
import okhttp3.ResponseBody;
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

    @GET("api/productos")
    Call<List<Product>> getProductos(@Header("Authorization") String authHeader);

    @GET("api/productos")
    Call<ResponseBody> getProductosRaw(@Header("Authorization") String token);

    @GET("api/ropa")
    Call<List<Product>> getRopa();

    @GET("api/accesorios")
    Call<List<Product>> getAccesorios();

    @POST("api/favoritos/update")
    Call<JsonObject> updateFavoritos(
            @Header("Authorization") String token,
            @Body Map<String, Object> data
    );
}
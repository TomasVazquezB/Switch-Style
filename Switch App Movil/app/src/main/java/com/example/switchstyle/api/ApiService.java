package com.example.switchstyle.api;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {

    @POST("api/mobile/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @POST("api/mobile/register")
    Call<AuthResponse> register(@Body RegisterRequest request);

    @GET("api/mobile/productos")
    Call<List<Product>> getProductos(@Header("Authorization") String authHeader);

    @GET("api/mobile/ropa")
    Call<List<Product>> getRopa();

    @GET("api/mobile/accesorios")
    Call<List<Product>> getAccesorios();

    @POST("api/mobile/productos/{id}/like")
    Call<Void> setLike(
            @Path("id") int productId,
            @Body Boolean meGusta,
            @Header("Authorization") String authHeader
    );
}
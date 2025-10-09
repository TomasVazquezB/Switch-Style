package com.example.switchstyle.api;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {

    // 🔹 LOGIN (Laravel espera email + password)
    @POST("login")
    Call<AuthResponse> login(@Body LoginRequest request);

    // 🔹 REGISTER (Laravel espera JSON, no form)
    @POST("register")
    Call<AuthResponse> register(@Body RegisterRequest request);

    // 🔹 PRODUCTOS (protegido → requiere token)
    @GET("productos")
    Call<List<Product>> getProductos(@Header("Authorization") String authHeader);

    // 🔹 ROPA (público)
    @GET("ropa")
    Call<List<Product>> getRopa();

    // 🔹 ACCESORIOS (público)
    @GET("accesorios")
    Call<List<Product>> getAccesorios();

    // 🔹 LIKE (protegido → enviamos el estado en el body)
    @POST("productos/{id}/like")
    Call<Void> setLike(
            @Path("id") int productId,
            @Body Boolean meGusta,  // Aquí se envía el boolean en el body
            @Header("Authorization") String authHeader
    );
}

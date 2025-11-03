// 📁 com/example/switchstyle/api/ApiService.java

package com.example.switchstyle.api;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {

    // 🔐 LOGIN para Android (token-based)
    @POST("api/mobile/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    // 🔐 REGISTER para Android (token-based)
    @POST("api/mobile/register")
    Call<AuthResponse> register(@Body RegisterRequest request);

    // 🔒 PRODUCTOS (requiere token)
    @GET("api/productos")
    Call<List<Product>> getProductos(@Header("Authorization") String authHeader);

    // 🌐 ROPA (público)
    @GET("api/ropa")
    Call<List<Product>> getRopa();

    // 🌐 ACCESORIOS (público)
    @GET("api/accesorios")
    Call<List<Product>> getAccesorios();

    // ❤️ LIKE (requiere token)
    @POST("api/productos/{id}/like")
    Call<Void> setLike(
            @Path("id") int productId,
            @Body Boolean meGusta,
            @Header("Authorization") String authHeader
    );
}

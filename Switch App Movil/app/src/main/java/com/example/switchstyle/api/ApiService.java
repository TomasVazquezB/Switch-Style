package com.example.switchstyle.api;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @FormUrlEncoded
    @POST("register")
    Call<AuthResponse> register(
            @Field("name") String name,
            @Field("email") String email,
            @Field("password") String password
    );

    @GET("productos")
    Call<List<Product>> getProductos(@Header("Authorization") String token);

    @GET("ropa")
    Call<List<Product>> getRopa();

    @GET("accesorios")
    Call<List<Product>> getAccesorios();

    @POST("productos/{id}/like")
    Call<Void> setLike(
            @Path("id") int productId,
            boolean nuevoEstado, @Header("Authorization") String token
    );
}
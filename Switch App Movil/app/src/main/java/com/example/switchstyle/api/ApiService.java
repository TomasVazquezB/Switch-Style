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
import retrofit2.http.Query;

public interface ApiService {

    @POST("login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @GET("products")
    Call<List<Product>> getProducts(@Header("Authorization") String token);

    @FormUrlEncoded
    @POST("register")
    Call<AuthResponse> register(
            @Field("name") String name,
            @Field("email") String email,
            @Field("password") String password
    );

    // Actualizar “me gusta” de un producto
    @POST("products/{id}/like")
    Call<Void> setLike(
            @Path("id") int productId,
            @Query("like") boolean like,
            @Header("Authorization") String token
    );
}

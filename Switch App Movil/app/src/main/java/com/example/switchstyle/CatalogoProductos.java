package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.example.switchstyle.api.ApiService;
import com.example.switchstyle.api.Imagen;
import com.example.switchstyle.api.Product;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.SessionManager;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CatalogoProductos extends AppCompatActivity {

    private static final String PREFS_FAVORITOS = "favoritos_prefs";
    private List<Publicacion> publicaciones;
    private PublicacionAdapter adapter;
    private SessionManager session;
    private SharedPreferences prefs;
    private ApiService apiService;
    private String userKey; // clave única por usuario

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        session = new SessionManager(this);
        prefs = getSharedPreferences(PREFS_FAVORITOS, Context.MODE_PRIVATE);
        apiService = RetrofitClient.getClient().create(ApiService.class);

        if (!session.isLoggedIn()) {
            setContentView(R.layout.activity_login_validation);
            findViewById(R.id.btnIrRegistro).setOnClickListener(v -> {
                startActivity(new Intent(this, LoginActivity.class));
                finish();
            });
            return;
        }

        userKey = "favoritos_" + session.getUserId();

        setContentView(R.layout.activity_catalogo_productos);
        setTitle("Catálogo de Productos");

        RecyclerView recyclerView = findViewById(R.id.recyclerViewProductos);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        publicaciones = new ArrayList<>();
        adapter = new PublicacionAdapter(publicaciones);
        recyclerView.setAdapter(adapter);

        cargarCatalogoCompleto();
        initNavigation();
    }

    private void initNavigation() {
        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        if (navHome != null)
            navHome.setOnClickListener(v -> Toast.makeText(this, "Inicio", Toast.LENGTH_SHORT).show());
        if (navRegister != null)
            navRegister.setOnClickListener(v -> Toast.makeText(this, "Registro", Toast.LENGTH_SHORT).show());
        if (navCatalogs != null)
            navCatalogs.setOnClickListener(v -> Toast.makeText(this, "Catálogo", Toast.LENGTH_SHORT).show());
    }

    @SuppressLint("NotifyDataSetChanged")
    private void cargarCatalogoCompleto() {
        publicaciones.clear();
        adapter.notifyDataSetChanged();

        String token = session.getToken();
        if (token == null || token.isEmpty()) {
            Toast.makeText(this, "Sesión expirada. Iniciá sesión nuevamente.", Toast.LENGTH_SHORT).show();
            return;
        }

        Set<String> favoritos = obtenerFavoritosLocales();

        cargarEndpoint(apiService.getProductos(token), favoritos);
        cargarEndpoint(apiService.getRopa(), favoritos);
        cargarEndpoint(apiService.getAccesorios(), favoritos);
    }

    private void cargarEndpoint(Call<List<Product>> call, Set<String> favoritos) {
        call.enqueue(new Callback<List<Product>>() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onResponse(@NonNull Call<List<Product>> call, @NonNull Response<List<Product>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (Product p : response.body()) {
                        List<String> imagenes = new ArrayList<>();

                        if (p.getImagenes() != null && !p.getImagenes().isEmpty()) {
                            for (Imagen img : p.getImagenes()) {
                                if (img.getUrl() != null && !img.getUrl().isEmpty()) {
                                    imagenes.add(img.getUrl());
                                } else if (img.getRuta() != null && !img.getRuta().isEmpty()) {
                                    imagenes.add("https://fls-9ff7de2a-dac8-4f28-a8fd-04a22564ad02.laravel.cloud/" + img.getRuta());
                                }
                            }
                        } else if (p.getImagen_url() != null && !p.getImagen_url().isEmpty()) {
                            imagenes.add(p.getImagen_url());
                        }

                        boolean esFav = favoritos.contains(String.valueOf(p.getId()));
                        publicaciones.add(new Publicacion(p.getId(), imagenes, esFav));
                    }

                    adapter.notifyDataSetChanged();
                } else {
                    Log.e("CatalogoProductos", "Error al cargar productos: código " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Product>> call, @NonNull Throwable t) {
                Log.e("CatalogoProductos", "Fallo al cargar productos: " + t.getMessage());
                Toast.makeText(CatalogoProductos.this, "Error al conectar con el servidor", Toast.LENGTH_SHORT).show();
            }
        });
    }

    // ==== FAVORITOS ====
    private Set<String> obtenerFavoritosLocales() {
        return new HashSet<>(prefs.getStringSet(userKey, new HashSet<>()));
    }

    private void guardarFavoritosLocales(Set<String> favs) {
        prefs.edit().putStringSet(userKey, favs).apply();
    }

    private void toggleFavorito(int idProducto) {
        Set<String> favs = obtenerFavoritosLocales();
        boolean agregado;

        if (favs.contains(String.valueOf(idProducto))) {
            favs.remove(String.valueOf(idProducto));
            agregado = false;
        } else {
            favs.add(String.valueOf(idProducto));
            agregado = true;
        }

        guardarFavoritosLocales(favs);
        if (session.isLoggedIn()) sincronizarConServidor(favs);

        Toast.makeText(this, agregado ? "Agregado a favoritos ❤️" : "Quitado de favoritos 🤍", Toast.LENGTH_SHORT).show();
    }

    private void sincronizarConServidor(Set<String> favs) {
        List<Integer> lista = new ArrayList<>();
        for (String s : favs) lista.add(Integer.parseInt(s));

        Map<String, Object> data = Map.of("favoritos", lista);
        String token = "Bearer " + session.getToken();

        apiService.updateFavoritos(token, data).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(@NonNull Call<JsonObject> call, @NonNull Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    Log.d("CatalogoProductos", "Favoritos sincronizados correctamente.");
                } else {
                    Log.e("CatalogoProductos", "Error al sincronizar favoritos: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<JsonObject> call, @NonNull Throwable t) {
                Log.e("CatalogoProductos", "Error al sincronizar favoritos: " + t.getMessage());
            }
        });
    }

    // ==== MODELO LOCAL ====
    public static class Publicacion {
        int id;
        List<String> urlsImagenes;
        boolean meGusta;

        public Publicacion(int id, List<String> urlsImagenes, boolean meGusta) {
            this.id = id;
            this.urlsImagenes = urlsImagenes;
            this.meGusta = meGusta;
        }
    }

    // ==== ADAPTER ====
    private class PublicacionAdapter extends RecyclerView.Adapter<PublicacionAdapter.PublicacionViewHolder> {
        private final List<Publicacion> publicaciones;

        PublicacionAdapter(List<Publicacion> publicaciones) {
            this.publicaciones = publicaciones;
        }

        @NonNull
        @Override
        public PublicacionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_publicacion, parent, false);
            return new PublicacionViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull PublicacionViewHolder holder, int position) {
            holder.bind(publicaciones.get(position));
        }

        @Override
        public int getItemCount() {
            return publicaciones.size();
        }

        class PublicacionViewHolder extends RecyclerView.ViewHolder {
            ViewPager2 viewPagerImagenes;
            ImageButton btnMeGusta;
            TextView tvContadorImagenes;
            ViewPager2.OnPageChangeCallback callback;

            PublicacionViewHolder(@NonNull View itemView) {
                super(itemView);
                viewPagerImagenes = itemView.findViewById(R.id.viewPagerImagenes);
                btnMeGusta = itemView.findViewById(R.id.btnMeGusta);
                tvContadorImagenes = itemView.findViewById(R.id.tvContadorImagenes);
            }

            void bind(Publicacion publicacion) {
                ImagenAdapter imagenAdapter = new ImagenAdapter(publicacion.urlsImagenes);
                viewPagerImagenes.setAdapter(imagenAdapter);

                btnMeGusta.setImageResource(publicacion.meGusta
                        ? R.drawable.favorite_filled_24px
                        : R.drawable.favorite_24px);

                btnMeGusta.setOnClickListener(v -> {
                    publicacion.meGusta = !publicacion.meGusta;
                    toggleFavorito(publicacion.id);
                    btnMeGusta.setImageResource(publicacion.meGusta
                            ? R.drawable.favorite_filled_24px
                            : R.drawable.favorite_24px);
                });

                // contador inicial
                if (publicacion.urlsImagenes != null && !publicacion.urlsImagenes.isEmpty()) {
                    tvContadorImagenes.setText(
                            itemView.getContext().getString(
                                    R.string.contador_imagenes,
                                    1,
                                    publicacion.urlsImagenes.size()
                            )
                    );
                } else {
                    tvContadorImagenes.setText("");
                }

                if (callback != null)
                    viewPagerImagenes.unregisterOnPageChangeCallback(callback);

                callback = new ViewPager2.OnPageChangeCallback() {
                    @Override
                    public void onPageSelected(int position) {
                        tvContadorImagenes.setText(
                                itemView.getContext().getString(
                                        R.string.contador_imagenes,
                                        position + 1,
                                        publicacion.urlsImagenes.size()
                                )
                        );
                    }
                };
                viewPagerImagenes.registerOnPageChangeCallback(callback);
            }
        }
    }

    // ==== ADAPTADOR DE IMÁGENES ====
    private static class ImagenAdapter extends RecyclerView.Adapter<ImagenAdapter.ImagenViewHolder> {
        private final List<String> urls;

        ImagenAdapter(List<String> urls) {
            this.urls = urls;
        }

        @NonNull
        @Override
        public ImagenViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_imagen, parent, false);
            return new ImagenViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ImagenViewHolder holder, int position) {
            String url = urls.get(position);
            holder.progressBar.setVisibility(View.VISIBLE);

            if (url == null || url.isEmpty()) {
                holder.progressBar.setVisibility(View.GONE);
                return;
            }

            Glide.with(holder.imageView.getContext())
                    .load(url)
                    .centerCrop()
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .listener(new RequestListener<Drawable>() {
                        @Override
                        public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Drawable> target, boolean isFirstResource) {
                            holder.progressBar.setVisibility(View.GONE);
                            Log.e("GlideError", "Error al cargar imagen: " + (e != null ? e.getMessage() : "Desconocido"));
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(@NonNull Drawable resource, Object model, Target<Drawable> target, DataSource dataSource, boolean isFirstResource) {
                            holder.progressBar.setVisibility(View.GONE);
                            return false;
                        }
                    })
                    .into(holder.imageView);
        }

        @Override
        public int getItemCount() {
            return urls.size();
        }

        static class ImagenViewHolder extends RecyclerView.ViewHolder {
            ImageView imageView;
            ProgressBar progressBar;

            ImagenViewHolder(@NonNull View itemView) {
                super(itemView);
                imageView = itemView.findViewById(R.id.imagenProducto);
                progressBar = itemView.findViewById(R.id.progressBarImagen);
            }
        }
    }
}

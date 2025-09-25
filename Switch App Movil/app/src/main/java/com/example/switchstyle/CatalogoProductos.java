package com.example.switchstyle;

import android.annotation.SuppressLint;
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
import com.example.switchstyle.api.Product;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.SessionManager;

import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CatalogoProductos extends AppCompatActivity {

    private RecyclerView recyclerView;
    private PublicacionAdapter adapter;
    private List<Publicacion> publicaciones;
    private boolean isLoading = false;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        session = new SessionManager(this);
        if (!session.isLoggedIn()) {
            setContentView(R.layout.activity_login_validation);
            findViewById(R.id.btnIrRegistro).setOnClickListener(v -> {
                startActivity(new android.content.Intent(this, LoginActivity.class));
                finish();
            });
            return;
        }

        setContentView(R.layout.activity_catalogo_productos);
        setTitle("Catálogo de productos");

        recyclerView = findViewById(R.id.recyclerViewProductos);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        publicaciones = new ArrayList<>();
        adapter = new PublicacionAdapter(publicaciones, session);
        recyclerView.setAdapter(adapter);

        cargarPublicaciones();

        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView rv, int dx, int dy) {
                super.onScrolled(rv, dx, dy);
                LinearLayoutManager lm = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (lm != null && !isLoading) {
                    int totalItemCount = lm.getItemCount();
                    int lastVisibleItem = lm.findLastVisibleItemPosition();
                    if (lastVisibleItem >= totalItemCount - 3) {
                        cargarPublicaciones();
                    }
                }
            }
        });

        initNavigation();
    }
    private void initNavigation() {
        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);
        if (navHome != null) navHome.setOnClickListener(v -> { /* bloqueado */ });
        if (navRegister != null) navRegister.setOnClickListener(v -> { /* bloqueado */ });
        if (navCatalogs != null) navCatalogs.setOnClickListener(v -> { /* ya estamos aquí */ });
    }
    @SuppressLint("NotifyDataSetChanged")
    private void cargarPublicaciones() {
        isLoading = true;
        ApiService apiService = RetrofitClient.getClient().create(ApiService.class);
        Call<List<Product>> call = apiService.getProductos("Bearer " + session.getToken());

        call.enqueue(new Callback<List<Product>>() {
            @Override
            public void onResponse(@NonNull Call<List<Product>> call, @NonNull Response<List<Product>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    publicaciones.clear();

                    for (Product p : response.body()) {
                        Publicacion pub = new Publicacion(
                                p.getId(),
                                p.getNombre(),
                                p.getCategoria(),
                                p.getUrlsImagenes(),
                                p.isMeGusta()
                        );
                        publicaciones.add(pub);
                    }

                    adapter.notifyDataSetChanged();
                }
                isLoading = false;
            }

            @Override
            public void onFailure(@NonNull Call<List<Product>> call, @NonNull Throwable t) {
                isLoading = false;
                Log.e("CatalogoProductos", "Error: " + t.getMessage());
            }
        });
    }
    public static class Publicacion {
        int id;
        String nombre;
        String categoria;
        List<String> urlsImagenes;
        boolean meGusta;

        public Publicacion(int id, String nombre, String categoria, List<String> urlsImagenes, boolean meGusta) {
            this.id = id;
            this.nombre = nombre;
            this.categoria = categoria;
            this.urlsImagenes = urlsImagenes;
            this.meGusta = meGusta;
        }
    }
    private static class PublicacionAdapter extends RecyclerView.Adapter<PublicacionAdapter.PublicacionViewHolder> {
        private final List<Publicacion> publicaciones;
        private final SessionManager session;

        PublicacionAdapter(List<Publicacion> publicaciones, SessionManager session) {
            this.publicaciones = publicaciones;
            this.session = session;
        }

        @NonNull
        @Override
        public PublicacionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_publicacion, parent, false);
            return new PublicacionViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull PublicacionViewHolder holder, int position) {
            Publicacion publicacion = publicaciones.get(position);
            ImagenAdapter imagenAdapter = new ImagenAdapter(publicacion.urlsImagenes);
            holder.viewPagerImagenes.setAdapter(imagenAdapter);

            holder.tvContadorImagenes.setVisibility(publicacion.urlsImagenes.size() > 1 ? View.VISIBLE : View.GONE);
            holder.tvContadorImagenes.setText(holder.tvContadorImagenes.getContext().getString(R.string.contador_imagenes, 1, publicacion.urlsImagenes.size()));

            holder.btnMeGusta.setImageResource(publicacion.meGusta ? R.drawable.favorite_filled_24px : R.drawable.favorite_24px);
            holder.btnMeGusta.setOnClickListener(v -> {
                boolean nuevoEstado = !publicacion.meGusta;
                publicacion.meGusta = nuevoEstado;
                holder.btnMeGusta.setImageResource(nuevoEstado ? R.drawable.favorite_filled_24px : R.drawable.favorite_24px);

                ApiService apiService = RetrofitClient.getClient().create(ApiService.class);
                Call<Void> call = apiService.setLike(publicacion.id, nuevoEstado, "Bearer " + session.getToken());
                call.enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {}
                    @Override
                    public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {}
                });
            });

            if (holder.pageChangeCallback != null) {
                holder.viewPagerImagenes.unregisterOnPageChangeCallback(holder.pageChangeCallback);
            }

            holder.pageChangeCallback = new ViewPager2.OnPageChangeCallback() {
                @Override
                public void onPageSelected(int pos) {
                    super.onPageSelected(pos);
                    holder.tvContadorImagenes.setText(holder.tvContadorImagenes.getContext().getString(R.string.contador_imagenes, pos + 1, publicacion.urlsImagenes.size()));
                }
            };
            holder.viewPagerImagenes.registerOnPageChangeCallback(holder.pageChangeCallback);
        }

        @Override
        public int getItemCount() {
            return publicaciones.size();
        }

        static class PublicacionViewHolder extends RecyclerView.ViewHolder {
            ViewPager2 viewPagerImagenes;
            ImageButton btnMeGusta;
            TextView tvContadorImagenes;
            ViewPager2.OnPageChangeCallback pageChangeCallback;

            PublicacionViewHolder(@NonNull View itemView) {
                super(itemView);
                viewPagerImagenes = itemView.findViewById(R.id.viewPagerImagenes);
                btnMeGusta = itemView.findViewById(R.id.btnMeGusta);
                tvContadorImagenes = itemView.findViewById(R.id.tvContadorImagenes);
            }
        }
    }
    private static class ImagenAdapter extends RecyclerView.Adapter<ImagenAdapter.ImagenViewHolder> {
        private final List<String> urls;

        ImagenAdapter(List<String> urls) {
            this.urls = urls;
        }

        @NonNull
        @Override
        public ImagenViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_imagen, parent, false);
            return new ImagenViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ImagenViewHolder holder, int position) {
            String url = urls.get(position);
            holder.progressBar.setVisibility(View.VISIBLE);
            Glide.with(holder.imageView.getContext())
                    .load(url)
                    .centerCrop()
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .listener(new RequestListener<Drawable>() {
                        @Override
                        public boolean onLoadFailed(@Nullable GlideException e, Object model, @NonNull Target<Drawable> target, boolean isFirstResource) {
                            holder.progressBar.setVisibility(View.GONE);
                            Log.e("GlideError", "Error loading image: " + (e != null ? e.getMessage() : "Unknown error"));
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(@NonNull Drawable resource, @NonNull Object model, @NonNull Target<Drawable> target, @NonNull DataSource dataSource, boolean isFirstResource) {
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
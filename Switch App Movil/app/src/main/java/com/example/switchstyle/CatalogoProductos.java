package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
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
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.List;

public class CatalogoProductos extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private RecyclerView recyclerView;
    private PublicacionAdapter adapter;
    private List<Publicacion> publicaciones;
    private boolean isLoading = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mAuth = FirebaseAuth.getInstance();

        if (!validarSesion()) return;

        setContentView(R.layout.activity_catalogo_productos);
        setTitle("Catálogo de productos");

        recyclerView = findViewById(R.id.recyclerViewProductos);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        publicaciones = new ArrayList<>();
        adapter = new PublicacionAdapter(publicaciones);
        recyclerView.setAdapter(adapter);

        cargarMasPublicaciones();

        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView rv, int dx, int dy) {
                super.onScrolled(rv, dx, dy);
                LinearLayoutManager lm = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (lm != null && !isLoading) {
                    int totalItemCount = lm.getItemCount();
                    int lastVisibleItem = lm.findLastVisibleItemPosition();

                    if (lastVisibleItem >= totalItemCount - 3) {
                        cargarMasPublicaciones();
                    }
                }
            }
        });

        initNavigation();
    }

    private boolean validarSesion() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            setContentView(R.layout.activity_login_validation);
            findViewById(R.id.btnIrRegistro).setOnClickListener(v -> {
                startActivity(new android.content.Intent(this, Register.class));
                finish();
            });
            return false;
        }
        return true;
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
    private void cargarMasPublicaciones() {
        isLoading = true;
        int startId = publicaciones.size() + 1;
        int PAGE_SIZE = 20;
        for (int i = 0; i < PAGE_SIZE; i++) {
            int pubId = startId + i;
            String categoria;
            switch (pubId % 4) {
                case 1:
                    categoria = "ropa_mujer";
                    break;
                case 2:
                    categoria = "ropa_hombre";
                    break;
                case 3:
                    categoria = "ropa_ninos";
                    break;
                default:
                    categoria = "accesorios";
            }
            int cantidadImagenes = 2 + (pubId % 4); // 2 a 5 imágenes
            boolean meGusta = (pubId % 3 == 0);
            publicaciones.add(new Publicacion(pubId, cantidadImagenes, meGusta, categoria));
        }
        adapter.notifyDataSetChanged();
        isLoading = false;
    }

    public static class Publicacion {
        int id;
        int cantidadImagenes;
        boolean meGusta;
        String categoria;
        List<String> urlsImagenes;

        Publicacion(int id, int cantidadImagenes, boolean meGusta, String categoria) {
            this.id = id;
            this.cantidadImagenes = cantidadImagenes;
            this.meGusta = meGusta;
            this.categoria = categoria;
            this.urlsImagenes = generarImagenesTematicas(id, cantidadImagenes, categoria);
        }

        private static List<String> generarImagenesTematicas(int idPublicacion, int cantidad, String categoria) {
            List<String> imgs = new ArrayList<>();
            String query;
            switch (categoria) {
                case "accesorios":
                    query = "accessories";
                    break;
                case "ropa_mujer":
                    query = "women fashion";
                    break;
                case "ropa_hombre":
                    query = "men fashion";
                    break;
                case "ropa_ninos":
                    query = "kids clothes";
                    break;
                default:
                    query = "clothes";
                    break;
            }
            for (int j = 0; j < cantidad; j++) {
                imgs.add("https://source.unsplash.com/800x800/?" + query.replace(" ", "%20") + "&sig=" + (idPublicacion * 10 + j));
            }
            return imgs;
        }
    }

    private static class PublicacionAdapter extends RecyclerView.Adapter<PublicacionAdapter.PublicacionViewHolder> {

        private final List<Publicacion> publicaciones;

        PublicacionAdapter(List<Publicacion> publicaciones) {
            this.publicaciones = publicaciones;
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
            ImagenAdapter imagenAdapter = new ImagenAdapter(publicacion.urlsImagenes, holder);
            holder.viewPagerImagenes.setAdapter(imagenAdapter);

            if (publicacion.cantidadImagenes > 1) {
                holder.tvContadorImagenes.setVisibility(View.VISIBLE);
                holder.tvContadorImagenes.setText(holder.tvContadorImagenes.getContext()
                        .getString(R.string.contador_imagenes, 1, publicacion.cantidadImagenes));
            } else {
                holder.tvContadorImagenes.setVisibility(View.GONE);
            }

            // Botón MeGusta
            holder.btnMeGusta.setImageResource(publicacion.meGusta
                    ? R.drawable.favorite_filled_24px
                    : R.drawable.favorite_24px);

            holder.btnMeGusta.setOnClickListener(v -> {
                publicacion.meGusta = !publicacion.meGusta;
                holder.btnMeGusta.setImageResource(publicacion.meGusta
                        ? R.drawable.favorite_filled_24px
                        : R.drawable.favorite_24px);
            });

            if (holder.pageChangeCallback != null) {
                holder.viewPagerImagenes.unregisterOnPageChangeCallback(holder.pageChangeCallback);
            }

            holder.pageChangeCallback = new ViewPager2.OnPageChangeCallback() {
                @Override
                public void onPageSelected(int pos) {
                    super.onPageSelected(pos);
                    holder.tvContadorImagenes.setText(holder.tvContadorImagenes.getContext()
                            .getString(R.string.contador_imagenes, pos + 1, publicacion.cantidadImagenes));
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

        ImagenAdapter(List<String> urls, PublicacionAdapter.PublicacionViewHolder holder) {
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
                        public boolean onLoadFailed(@Nullable GlideException e, Object model,
                                                    @NonNull Target<Drawable> target, boolean isFirstResource) {
                            holder.progressBar.setVisibility(View.GONE);
                            // No fondo rojo o negro
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(@NonNull Drawable resource, @NonNull Object model,
                                                       Target<Drawable> target, @NonNull DataSource dataSource, boolean isFirstResource) {
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

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}

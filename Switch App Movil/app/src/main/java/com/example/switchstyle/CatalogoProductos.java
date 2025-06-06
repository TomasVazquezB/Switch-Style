package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;

public class CatalogoProductos extends AppCompatActivity {

    private RecyclerView recyclerView;
    private List<Publicacion> publicaciones;

    // Barra de navegación
    private LinearLayout navHome, navRegister, navCatalogs;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ✅ Verificación de login
        SharedPreferences prefs = getSharedPreferences("mi_app_prefs", MODE_PRIVATE);
        boolean isLoggedIn = prefs.getBoolean("logueado", false);

        if (!isLoggedIn) {
            // Mostrar layout de validación si no está logueado
            setContentView(R.layout.activity_login_validation);

            // Configurar botón para ir al registro
            findViewById(R.id.btnIrRegistro).setOnClickListener(v -> {
                Intent intent = new Intent(CatalogoProductos.this, Register.class);
                startActivity(intent);
                finish();
            });

            return;
        }

        setContentView(R.layout.activity_catalogo_productos);

        recyclerView = findViewById(R.id.recyclerViewProductos);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        publicaciones = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            publicaciones.add(new Publicacion((i % 3) + 1, i % 2 == 0));
        }

        PublicacionAdapter adapter = new PublicacionAdapter(publicaciones);
        recyclerView.setAdapter(adapter);

        // ✅ Configurar navegación
        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            startActivity(new Intent(this, MainActivity.class));
            finish();
        });

        navRegister.setOnClickListener(v -> {
            FirebaseAuth.getInstance().signOut();
            getSharedPreferences("mi_app_prefs", MODE_PRIVATE).edit().clear().apply();
            Intent intent = new Intent(this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });

        navCatalogs.setOnClickListener(v -> {
            // Ya estás en catálogo
        });
    }

    public static class Publicacion {
        int cantidadImagenes;
        boolean meGusta;

        Publicacion(int cantidadImagenes, boolean meGusta) {
            this.cantidadImagenes = cantidadImagenes;
            this.meGusta = meGusta;
        }
    }

    private class PublicacionAdapter extends RecyclerView.Adapter<PublicacionAdapter.PublicacionViewHolder> {

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
            ImagenAdapter imagenAdapter = new ImagenAdapter(publicacion.cantidadImagenes);
            holder.viewPagerImagenes.setAdapter(imagenAdapter);

            // Corazón
            holder.btnMeGusta.setImageResource(publicacion.meGusta
                    ? R.drawable.favorite_filled_24px
                    : R.drawable.favorite_24px);

            holder.btnMeGusta.setOnClickListener(v -> {
                publicacion.meGusta = !publicacion.meGusta;
                holder.btnMeGusta.setImageResource(publicacion.meGusta
                        ? R.drawable.favorite_filled_24px
                        : R.drawable.favorite_24px);
            });
        }

        @Override
        public int getItemCount() {
            return publicaciones.size();
        }

        class PublicacionViewHolder extends RecyclerView.ViewHolder {
            ViewPager2 viewPagerImagenes;
            ImageButton btnMeGusta;

            PublicacionViewHolder(@NonNull View itemView) {
                super(itemView);
                viewPagerImagenes = itemView.findViewById(R.id.viewPagerImagenes);
                btnMeGusta = itemView.findViewById(R.id.btnMeGusta);
            }
        }
    }

    private static class ImagenAdapter extends RecyclerView.Adapter<ImagenAdapter.ImagenViewHolder> {

        private final int cantidad;

        ImagenAdapter(int cantidad) {
            this.cantidad = cantidad;
        }

        @NonNull
        @Override
        public ImagenViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_imagen, parent, false);
            return new ImagenViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ImagenViewHolder holder, int position) {
            int[] colores = {Color.LTGRAY, Color.DKGRAY, Color.GRAY, Color.CYAN, Color.MAGENTA};
            int color = colores[position % colores.length];
            holder.imageView.setImageDrawable(new ColorDrawable(color));
        }

        @Override
        public int getItemCount() {
            return cantidad;
        }

        class ImagenViewHolder extends RecyclerView.ViewHolder {
            ImageView imageView;

            ImagenViewHolder(@NonNull View itemView) {
                super(itemView);
                imageView = itemView.findViewById(R.id.imagenProducto);
            }
        }
    }
}

package com.example.switchstyle;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import java.util.ArrayList;
import java.util.List;

public class CatalogoProductos extends AppCompatActivity {

    private RecyclerView recyclerView;
    private List<Publicacion> publicaciones;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_catalogo_productos);

        recyclerView = findViewById(R.id.recyclerViewProductos);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Carga de publicaciones simuladas sin imágenes
        publicaciones = new ArrayList<>();
        publicaciones.add(new Publicacion(3, false)); // 3 "imágenes"
        publicaciones.add(new Publicacion(1, true));  // 1 "imagen"
        publicaciones.add(new Publicacion(2, false)); // 2 "imágenes"

        PublicacionAdapter adapter = new PublicacionAdapter(publicaciones);
        recyclerView.setAdapter(adapter);
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

            // Adapter de imágenes simuladas
            ImagenAdapter imagenAdapter = new ImagenAdapter(publicacion.cantidadImagenes);
            holder.viewPagerImagenes.setAdapter(imagenAdapter);

            // Corazón me gusta
            holder.btnMeGusta.setColorFilter(publicacion.meGusta ? Color.RED : Color.WHITE);
            holder.btnMeGusta.setOnClickListener(v -> {
                publicacion.meGusta = !publicacion.meGusta;
                holder.btnMeGusta.setColorFilter(publicacion.meGusta ? Color.RED : Color.WHITE);
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
            // Simula una imagen con un color de fondo diferente
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
                imageView = itemView.findViewById(R.id.imagenProducto); // Asegúrate de que este ID exista
            }
        }
    }
}

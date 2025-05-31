package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    private LinearLayout navHome, navRegister, navCatalogs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        // Firebase Auth y Firestore
        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        FirebaseFirestore mFirestore = FirebaseFirestore.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        if (currentUser == null) {
            // Usuario no logueado: ir a Login
            startActivity(new Intent(MainActivity.this, LoginActivity.class));
            finish();
            return;
        } else {
            // Usuario logueado: obtener datos si quieres
            String userId = currentUser.getUid();
            mFirestore.collection("user").document(userId).get()
                    .addOnSuccessListener(documentSnapshot -> {
                        // Aquí puedes manejar datos del usuario
                    })
                    .addOnFailureListener(e -> {
                        // Manejo de error
                    });
        }

        // Referencias a la barra de navegación
        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        // Listener Home (estamos en MainActivity)
        navHome.setOnClickListener(v -> {
            // Ya estamos en esta pantalla, no hacemos nada o refrescamos si quieres
        });

        // Listener Registro
        navRegister.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, Register.class);
            startActivity(intent);
        });

        // Listener Catálogos
        navCatalogs.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, CatalogoProductos.class);
            startActivity(intent);
        });
    }
}

package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class MainActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();

        verificarSesion(); // Verificamos si ya hay un usuario logueado

        // Navegación
        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            // Acción para Home si tenés alguna
        });

        navRegister.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, Register.class))
        );

        navCatalogs.setOnClickListener(v -> {
            FirebaseUser user = mAuth.getCurrentUser();
            if (user != null) {
                Intent intent = new Intent(MainActivity.this, CatalogoProductos.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                finish();
            } else {
                setContentView(R.layout.activity_login_validation);
                setTitle("Acceso restringido");
                Button btnIrLoginDesdeValidacion = findViewById(R.id.btnIrRegistro);
                btnIrLoginDesdeValidacion.setOnClickListener(view -> {
                    startActivity(new Intent(MainActivity.this, LoginActivity.class));
                    finish();
                });
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        verificarSesion(); // Por si vuelve del background y hay sesión
    }

    private void verificarSesion() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null) {
            // Usuario logueado: redirigir directamente
            Intent intent = new Intent(MainActivity.this, CatalogoProductos.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finishAffinity(); // Cierra la app completamente
    }
}

package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.api.SessionManager;
import com.example.switchstyle.ui.login.LoginActivity;

public class MainActivity extends AppCompatActivity {

    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        session = new SessionManager(this);
        verificarSesion();

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        // 👉 Botón Home (puedes añadir lógica o dejarlo vacío)
        navHome.setOnClickListener(v -> {
            // Ejemplo: mostrar un Toast o redirigir a otra Activity
        });

        // 👉 Botón Register
        navRegister.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, Register.class)));

        // 👉 Botón Catálogos
        navCatalogs.setOnClickListener(v -> {
            if (session.isLoggedIn()) {
                // Si hay sesión activa → ir a productos
                Intent intent = new Intent(MainActivity.this, CatalogoProductos.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                finish();
            } else {
                // Si no hay sesión → mostrar validación
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
        verificarSesion();
    }

    private void verificarSesion() {
        // ✅ Ahora la sesión depende del token guardado
        if (session.isLoggedIn()) {
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

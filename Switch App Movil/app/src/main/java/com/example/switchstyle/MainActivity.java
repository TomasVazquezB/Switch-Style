package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class MainActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;

    // Variables estáticas para conteo de actividades y manejo sesión
    private static int activityReferences = 0;
    private static boolean isActivityChangingConfigurations = false;

    private static Handler staticHandler = new Handler(Looper.getMainLooper());
    private static Runnable staticSignOutRunnable;

    // Tiempo para cerrar sesión tras ir a background (en ms)
    private static final long SIGN_OUT_DELAY = 60000; // 1 minuto

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();

        // Runnable estático que cierra sesión y redirige a Login
        staticSignOutRunnable = () -> {
            FirebaseAuth.getInstance().signOut();
            // Para redirigir necesitamos un contexto, usaremos un intent con FLAG_ACTIVITY_NEW_TASK
            Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();  // Cierra esta activity
        };

        verificarSesion();

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            // Acción para Home si tienes alguna
        });

        navRegister.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, Register.class)));

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
        activityStarted();
        staticHandler.removeCallbacks(staticSignOutRunnable);
        verificarSesion();
    }

    @Override
    protected void onStop() {
        super.onStop();
        activityStopped(isChangingConfigurations());
    }

    private void verificarSesion() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null) {
            Intent intent = new Intent(MainActivity.this, CatalogoProductos.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finishAffinity();
    }

    // Métodos estáticos para manejar conteo de actividades

    public static void activityStarted() {
        if (++activityReferences == 1 && !isActivityChangingConfigurations) {
            // App vuelve a foreground: cancelamos cierre de sesión
            staticHandler.removeCallbacks(staticSignOutRunnable);
        }
    }

    public static void activityStopped(boolean isChangingConfigurations) {
        isActivityChangingConfigurations = isChangingConfigurations;
        if (--activityReferences == 0 && !isActivityChangingConfigurations) {
            // App pasa a background: programamos cierre de sesión
            staticHandler.postDelayed(staticSignOutRunnable, SIGN_OUT_DELAY);
        }
    }
}

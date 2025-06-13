package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class ReiniciarContra extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private EditText editEmail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_olvidocontra);
        setTitle("Restablecer contraseña");

        // Firebase auth
        mAuth = FirebaseAuth.getInstance();

        // Referencias según XML corregido
        editEmail = findViewById(R.id.email_recuperacion);
        Button btnReset = findViewById(R.id.recuperar_contrasena);

        // Botón para enviar email de recuperación
        btnReset.setOnClickListener(v -> {
            String email = editEmail.getText().toString().trim();
            if (TextUtils.isEmpty(email)) {
                Toast.makeText(this, "Por favor ingresa tu correo", Toast.LENGTH_SHORT).show();
            } else {
                mAuth.sendPasswordResetEmail(email)
                        .addOnCompleteListener(task -> {
                            if (task.isSuccessful()) {
                                Toast.makeText(this, "Correo de recuperación enviado", Toast.LENGTH_LONG).show();
                                startActivity(new Intent(this, LoginActivity.class));
                                finishAffinity(); // Cierra esta y las actividades anteriores
                            } else {
                                Toast.makeText(this, "Error al enviar el correo", Toast.LENGTH_SHORT).show();
                            }
                        });
            }
        });

        // Navegación inferior
        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            startActivity(new Intent(this, MainActivity.class));
            finishAffinity();
        });

        navRegister.setOnClickListener(v -> {
            startActivity(new Intent(this, Register.class));
            finishAffinity();
        });

        navCatalogs.setOnClickListener(v -> {
            FirebaseUser user = mAuth.getCurrentUser();
            if (user != null) {
                startActivity(new Intent(this, CatalogoProductos.class));
                finishAffinity();
            } else {
                // Muestra pantalla de validación si no está logueado
                setContentView(R.layout.activity_login_validation);
                setTitle("Acceso restringido");

                Button btnIrLoginDesdeValidacion = findViewById(R.id.btnIrRegistro);
                btnIrLoginDesdeValidacion.setOnClickListener(view -> {
                    startActivity(new Intent(this, LoginActivity.class));
                    finishAffinity();
                });
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        FirebaseAuth.getInstance().signOut(); // Cierra sesión si cierra la app completamente
    }
}

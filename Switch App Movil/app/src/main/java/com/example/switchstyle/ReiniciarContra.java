package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.TypedValue;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.view.ViewCompat;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;

public class ReiniciarContra extends AppCompatActivity {

    private EditText editTextEmail;
    private FirebaseAuth mAuth;

    private LinearLayout navHome, navRegister, navCatalogs;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_olvidocontra);

        mAuth = FirebaseAuth.getInstance();
        editTextEmail = findViewById(R.id.contraseña_recuperada);

        Button buttonRestablecerContraseña = findViewById(R.id.recuperar_contraseña);
        buttonRestablecerContraseña.setOnClickListener(v -> {
            String email = editTextEmail.getText().toString().trim();

            if (email.isEmpty()) {
                Toast.makeText(ReiniciarContra.this, "Falta ingresar el email", Toast.LENGTH_SHORT).show();
                return;
            }

            mAuth.sendPasswordResetEmail(email)
                    .addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            Toast.makeText(ReiniciarContra.this, "Se ha enviado un correo para restablecer tu contraseña", Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(ReiniciarContra.this, LoginActivity.class));
                            finish();
                        } else {
                            Toast.makeText(ReiniciarContra.this, "Error al enviar correo de recuperación", Toast.LENGTH_SHORT).show();
                        }
                    });
        });

        LinearLayout navigationBar = findViewById(R.id.navigationBar);
        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> startActivity(new Intent(ReiniciarContra.this, MainActivity.class)));
        navRegister.setOnClickListener(v -> startActivity(new Intent(ReiniciarContra.this, Register.class)));
        navCatalogs.setOnClickListener(v -> startActivity(new Intent(ReiniciarContra.this, CatalogoProductos.class)));

        final int baseHeightPx = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                70,
                getResources().getDisplayMetrics()
        );

        ViewCompat.setOnApplyWindowInsetsListener(navigationBar, (v, insets) -> {
            int bottomInset = insets.getSystemWindowInsetBottom();

            ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) v.getLayoutParams();
            params.height = baseHeightPx + bottomInset;
            v.setLayoutParams(params);

            v.setPadding(v.getPaddingLeft(), v.getPaddingTop(), v.getPaddingRight(), bottomInset);

            return insets.consumeSystemWindowInsets();
        });
    }
}

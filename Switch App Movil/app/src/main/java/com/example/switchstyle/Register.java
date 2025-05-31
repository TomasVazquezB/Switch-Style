package com.example.switchstyle;

import android.annotation.SuppressLint;
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
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Register extends AppCompatActivity {

    private EditText name, email, password;
    private FirebaseFirestore mFirestore;
    private FirebaseAuth mAuth;

    private LinearLayout navHome, navRegister, navCatalogs;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);
        setTitle(R.string.registro_title);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);

        // Inicializa Firebase
        mFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        // Referencias UI
        name = findViewById(R.id.Nombre);
        email = findViewById(R.id.Email);
        password = findViewById(R.id.Contraseña);
        Button btnRegister = findViewById(R.id.Button_registro);
        Button btnIrLogin = findViewById(R.id.buttonIrALogin);

        // Click en botón registrar
        btnRegister.setOnClickListener(v -> {
            String nameUser = name.getText().toString().trim();
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();

            if (TextUtils.isEmpty(nameUser) && TextUtils.isEmpty(emailUser) && TextUtils.isEmpty(passUser)) {
                Toast.makeText(this, R.string.error_campos_vacios, Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(nameUser)) {
                Toast.makeText(this, R.string.error_nombre_vacio, Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(emailUser)) {
                Toast.makeText(this, R.string.error_email_vacio, Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(passUser)) {
                Toast.makeText(this, R.string.error_contraseña_vacia, Toast.LENGTH_SHORT).show();
            } else if (passUser.length() < 6) {
                Toast.makeText(this, R.string.error_contraseña_corta, Toast.LENGTH_SHORT).show();
            } else {
                registerUser(nameUser, emailUser, passUser);
            }
        });

        // Click para ir a login
        btnIrLogin.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, LoginActivity.class));
            finish();
        });

        // Referencias navegación inferior
        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, MainActivity.class));
        });

        navRegister.setOnClickListener(v -> {
            // Ya estamos en registro, no hacer nada
        });

        navCatalogs.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, CatalogoProductos.class));
        });
    }

    private void registerUser(String nameUser, String emailUser, String passUser) {
        mAuth.createUserWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                String userId = Objects.requireNonNull(mAuth.getCurrentUser()).getUid();

                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", userId);
                userMap.put("name", nameUser);
                userMap.put("email", emailUser);

                mFirestore.collection("user").document(userId).set(userMap)
                        .addOnSuccessListener(aVoid -> {
                            Toast.makeText(this, R.string.registro_exitoso, Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(Register.this, LoginActivity.class));
                            finish();
                        })
                        .addOnFailureListener(e -> Toast.makeText(this, getString(R.string.error_registro_generico) + ": " + e.getMessage(), Toast.LENGTH_LONG).show());
            } else {
                String error = task.getException() != null ? task.getException().getMessage() : "";
                if (error != null && error.contains("email address is already in use")) {
                    Toast.makeText(this, R.string.error_email_existente, Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(this, getString(R.string.error_registro_generico) + ": " + error, Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}

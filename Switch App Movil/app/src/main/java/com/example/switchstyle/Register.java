package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Register extends AppCompatActivity {

    private EditText name, email, password;
    private FirebaseFirestore mFirestore;
    private FirebaseAuth mAuth;
    private static final String TAG = "RegisterActivity";

    @Override
    protected void onStart() {
        super.onStart();
        if (mAuth == null) mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null) {
            FirebaseAuth.getInstance().signOut();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);

        setTitle(R.string.registro_title);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);

        mFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        name = findViewById(R.id.Nombre);
        email = findViewById(R.id.Email);
        password = findViewById(R.id.Contraseña);
        Button btnRegister = findViewById(R.id.Button_registro);
        Button btnIrLogin = findViewById(R.id.buttonIrALogin);

        btnRegister.setOnClickListener(v -> {
            String nameUser = name.getText().toString().trim();
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();

            if (TextUtils.isEmpty(nameUser) || TextUtils.isEmpty(emailUser) || TextUtils.isEmpty(passUser)) {
                Toast.makeText(this, R.string.error_campos_vacios, Toast.LENGTH_SHORT).show();
            } else if (passUser.length() < 6) {
                Toast.makeText(this, R.string.error_contraseña_corta, Toast.LENGTH_SHORT).show();
            } else {
                registerUser(nameUser, emailUser, passUser);
            }
        });

        btnIrLogin.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, LoginActivity.class));
            finishAffinity();
        });

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, MainActivity.class));
            finishAffinity();
        });

        navRegister.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, LoginActivity.class));
            finishAffinity();
        });

        navCatalogs.setOnClickListener(v -> {
            FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
            if (user != null) {
                startActivity(new Intent(Register.this, CatalogoProductos.class));
                finishAffinity();
            } else {
                setContentView(R.layout.activity_login_validation);
                setTitle("Acceso restringido");

                Button btnIrLoginDesdeValidacion = findViewById(R.id.btnIrRegistro);
                btnIrLoginDesdeValidacion.setOnClickListener(view -> {
                    startActivity(new Intent(Register.this, LoginActivity.class));
                    finishAffinity();
                });
            }
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

                            FirebaseAuth.getInstance().signOut();

                            Intent intent = new Intent(Register.this, LoginActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            startActivity(intent);
                            finish();
                        })
                        .addOnFailureListener(e -> {
                            Log.e(TAG, "Fallo al guardar en Firestore", e);
                            Toast.makeText(this, getString(R.string.error_registro_generico) + ": " + e.getMessage(), Toast.LENGTH_LONG).show();
                        });
            } else {
                String error = task.getException() != null ? task.getException().getMessage() : "";
                Log.e(TAG, "Fallo al registrar: " + error);
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

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finishAffinity();
    }
}
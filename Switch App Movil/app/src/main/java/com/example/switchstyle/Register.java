package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.api.ApiService;
import com.example.switchstyle.api.AuthResponse;
import com.example.switchstyle.api.RegisterRequest;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Register extends AppCompatActivity {

    private EditText etNombre, etEmail, etPassword;
    private SessionManager session;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);

        session = new SessionManager(this);

        // EditTexts
        etNombre = findViewById(R.id.Nombre);
        etEmail = findViewById(R.id.Email);
        etPassword = findViewById(R.id.password);

        // Buttons
        Button btnRegister = findViewById(R.id.btnIrRegistro);
        Button btnIrLogin = findViewById(R.id.buttonIrALogin);

        // Navbar
        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        // ✅ Registro
        if (btnRegister != null) {
            btnRegister.setOnClickListener(v -> {
                String nameUser = etNombre.getText().toString().trim();
                String emailUser = etEmail.getText().toString().trim();
                String passUser = etPassword.getText().toString().trim();

                if (TextUtils.isEmpty(nameUser) || TextUtils.isEmpty(emailUser) || TextUtils.isEmpty(passUser)) {
                    Toast.makeText(Register.this, "Todos los campos son obligatorios", Toast.LENGTH_SHORT).show();
                    return;
                }

                registerUser(nameUser, emailUser, passUser);
            });
        }

        // ✅ Ir a Login
        if (btnIrLogin != null) {
            btnIrLogin.setOnClickListener(v -> {
                startActivity(new Intent(Register.this, LoginActivity.class));
                finish();
            });
        }

        // ✅ Navbar
        if (navHome != null) navHome.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, MainActivity.class));
            finishAffinity();
        });

        if (navRegister != null) navRegister.setOnClickListener(v -> {
            // Ya estamos en Register, no hacemos nada
        });

        if (navCatalogs != null) navCatalogs.setOnClickListener(v -> {
            if (session.isLoggedIn()) {
                startActivity(new Intent(Register.this, CatalogoProductos.class));
                finishAffinity();
            } else {
                Toast.makeText(Register.this, "Acceso restringido. Logueate primero", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void registerUser(String nameUser, String emailUser, String passUser) {
        ApiService apiService = RetrofitClient.getClient().create(ApiService.class);

        RegisterRequest request = new RegisterRequest(nameUser, emailUser, passUser);

        Call<AuthResponse> call = apiService.register(request);
        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(@NonNull Call<AuthResponse> call, @NonNull Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse auth = response.body();

                    if (auth.getToken() != null) session.saveToken(auth.getToken());
                    if (auth.getUser() != null) session.saveUser(auth.getUser());

                    Toast.makeText(Register.this, "Registro exitoso", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(Register.this, LoginActivity.class));
                    finish();
                } else {
                    Log.e("Register", "Error response: " + response.code());
                    Toast.makeText(Register.this, "Error en el registro", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<AuthResponse> call, @NonNull Throwable t) {
                Log.e("Register", "Failure: " + t.getMessage());
                Toast.makeText(Register.this, "Fallo en la conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(Register.this, MainActivity.class));
        finishAffinity();
    }
}

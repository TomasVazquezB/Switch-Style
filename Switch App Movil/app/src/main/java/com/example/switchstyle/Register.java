package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.switchstyle.api.AuthResponse;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.ApiService;
import com.example.switchstyle.api.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Register extends AppCompatActivity {
    private EditText name, email, password;
    private ApiService apiService;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);

        setTitle(R.string.registro_title);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        apiService = RetrofitClient.getClient().create(ApiService.class);
        session = new SessionManager(this);

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
            if (session.isLoggedIn()) {
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
        Call<AuthResponse> call = apiService.register(nameUser, emailUser, passUser);

        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(@NonNull Call<AuthResponse> call, @NonNull Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse authResponse = response.body();

                    if (authResponse.getToken() != null) {
                        session.saveToken(authResponse.getToken());
                        Toast.makeText(Register.this, R.string.registro_exitoso, Toast.LENGTH_SHORT).show();

                        Intent intent = new Intent(Register.this, CatalogoProductos.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Register.this, R.string.registro_exitoso, Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(Register.this, LoginActivity.class));
                        finish();
                    }
                } else {
                    Toast.makeText(Register.this, getString(R.string.error_registro_generico), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<AuthResponse> call, @NonNull Throwable t) {
                Toast.makeText(Register.this, "Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
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
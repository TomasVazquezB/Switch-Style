package com.example.switchstyle;

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
import com.example.switchstyle.api.LoginRequest;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    private EditText email, password;
    private SessionManager sessionManager;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setTitle("Login");

        email = findViewById(R.id.username);
        password = findViewById(R.id.password);
        Button btnLogin = findViewById(R.id.login);

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        sessionManager = new SessionManager(this);
        apiService = RetrofitClient.getClient().create(ApiService.class);

        // Si ya está logueado, ir directamente al catálogo
        if (sessionManager.isLoggedIn()) {
            startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
            finish();
        }

        // Botón de login
        btnLogin.setOnClickListener(view -> {
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();

            if (TextUtils.isEmpty(emailUser) || TextUtils.isEmpty(passUser)) {
                Toast.makeText(this, "Completá todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }

            loginUser(emailUser, passUser);
        });

        // Navegación inferior
        navHome.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finish();
        });

        navRegister.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, Register.class));
            finish();
        });

        navCatalogs.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                Intent intent = new Intent(LoginActivity.this, CatalogoProductos.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                finish();
            } else {
                // Mostrar pantalla de validación como en MainActivity
                setContentView(R.layout.activity_login_validation);
                setTitle("Acceso restringido");

                Button btnIrLoginDesdeValidacion = findViewById(R.id.btnIrRegistro);
                btnIrLoginDesdeValidacion.setOnClickListener(view -> {
                    startActivity(new Intent(LoginActivity.this, LoginActivity.class));
                    finish();
                });
            }
        });
    }

    private void loginUser(String emailUser, String passUser) {
        LoginRequest request = new LoginRequest(emailUser, passUser);

        Call<AuthResponse> call = apiService.login(request);
        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(@NonNull Call<AuthResponse> call, @NonNull Response<AuthResponse> response) {
                Log.d("LoginActivity", "response code: " + response.code() + " body: " + response.body());

                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse auth = response.body();

                    if (auth.getToken() != null) {
                        sessionManager.saveToken(auth.getToken());
                    }

                    if (auth.getUser() != null) {
                        sessionManager.saveUser(auth.getUser());
                    }

                    String userName = (auth.getUser() != null && auth.getUser().getNombre() != null)
                            ? auth.getUser().getNombre() : "usuario";
                    Toast.makeText(LoginActivity.this, "Bienvenido/a " + userName, Toast.LENGTH_LONG).show();

                    startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Email o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<AuthResponse> call, @NonNull Throwable t) {
                Log.e("LoginActivity", "Error en login", t);
                Toast.makeText(LoginActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(LoginActivity.this, MainActivity.class));
        finish();
    }
}

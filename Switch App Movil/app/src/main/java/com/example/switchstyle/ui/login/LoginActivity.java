package com.example.switchstyle.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.CatalogoProductos;
import com.example.switchstyle.MainActivity;
import com.example.switchstyle.R;
import com.example.switchstyle.Register;
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
    private Button btnLogin;
    private LinearLayout navHome, navRegister, navCatalogs;
    private SessionManager sessionManager;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setTitle("Login");

        email = findViewById(R.id.username);
        password = findViewById(R.id.password);
        btnLogin = findViewById(R.id.login);

        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        sessionManager = new SessionManager(this);
        apiService = RetrofitClient.getClient().create(ApiService.class);

        // Si ya hay token, saltar al catálogo
        if (sessionManager.isLoggedIn()) {
            startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
            finish();
        }

        btnLogin.setOnClickListener(view -> {
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();
            if (TextUtils.isEmpty(emailUser) || TextUtils.isEmpty(passUser)) {
                Toast.makeText(this, "Completá todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }
            loginUser(emailUser, passUser);
        });

        // Navegación barra inferior
        navHome.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finishAffinity();
        });

        navRegister.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, Register.class));
            finishAffinity();
        });

        navCatalogs.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                // Usuario logueado → ir al catálogo
                startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
                finishAffinity();
            } else {
                // No logueado → mostrar pantalla de validación
                setContentView(R.layout.activity_login_validation);
                setTitle("Acceso restringido");

                Button btnIrLoginDesdeValidacion = findViewById(R.id.btnIrRegistro);
                btnIrLoginDesdeValidacion.setOnClickListener(view2 -> {
                    // Volver al login
                    startActivity(new Intent(LoginActivity.this, LoginActivity.class));
                    finishAffinity();
                });
            }
        });
    }

    private void loginUser(String emailUser, String passUser) {
        LoginRequest request = new LoginRequest(emailUser, passUser);
        Call<AuthResponse> call = apiService.login(request);
        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse auth = response.body();
                    sessionManager.saveToken(auth.getToken());

                    String userName = (auth.getUser() != null && auth.getUser().getName() != null)
                            ? auth.getUser().getName()
                            : "usuario";

                    Toast.makeText(LoginActivity.this, "Bienvenido/a " + userName, Toast.LENGTH_LONG).show();

                    startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Email o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                Toast.makeText(LoginActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onBackPressed() {
        // Al presionar atrás desde login, volver al home
        super.onBackPressed();
        startActivity(new Intent(LoginActivity.this, MainActivity.class));
        finishAffinity();
    }
}

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
import com.example.switchstyle.api.RegisterRequest;
import com.example.switchstyle.api.RetrofitClient;
import com.example.switchstyle.api.SessionManager;
import org.json.JSONObject;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Register extends AppCompatActivity {
    private EditText etNombre, etEmail, etPassword;
    private SessionManager session;
    private static final String TAG = "RegisterActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);
        setTitle("Registro");

        session = new SessionManager(this);
        etNombre = findViewById(R.id.Nombre);
        etEmail = findViewById(R.id.Email);
        etPassword = findViewById(R.id.Contraseña);

        Button btnRegister = findViewById(R.id.Button_registro);
        Button btnIrLogin = findViewById(R.id.buttonIrALogin);

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        if (btnRegister != null) {
            btnRegister.setOnClickListener(v -> {
                Log.d("ButtonCheck", "¡Hiciste click en el botón de Registrar!");

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

        if (btnIrLogin != null) {
            btnIrLogin.setOnClickListener(v -> {
                startActivity(new Intent(Register.this, LoginActivity.class));
                finish();
            });
        }

        if (navHome != null) navHome.setOnClickListener(v -> {
            startActivity(new Intent(Register.this, MainActivity.class));
            finishAffinity();
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
        RegisterRequest request = new RegisterRequest(nameUser, emailUser, passUser, "Free");

        Call<AuthResponse> call = apiService.register(request);
        call.enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(@NonNull Call<AuthResponse> call, @NonNull Response<AuthResponse> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(Register.this, "Registro exitoso. Por favor, inicia sesión", Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Registro exitoso. Redirigiendo a Login");
                    startActivity(new Intent(Register.this, LoginActivity.class));
                    finish();
                } else if (response.errorBody() != null) {
                    try {
                        String errorResponse = response.errorBody().string();
                        Log.e(TAG, "Error del Servidor - Código: " + response.code() + ", Cuerpo: " + errorResponse);

                        JSONObject jsonObject = new JSONObject(errorResponse);
                        String errorMessage = "Error en el registro";

                        if (response.code() == 422) {
                            errorMessage = jsonObject.optString("message", "Datos inválidos (422)");
                        } else if (response.code() == 500) {
                            String apiMessage = jsonObject.optString("message", "Error interno (500)");
                            errorMessage = "Error 500: " + apiMessage + " (Revisa el log de Laravel).";
                        }

                        Toast.makeText(Register.this, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        Log.e(TAG, "Error al procesar el error del servidor: " + e.getMessage());
                        Toast.makeText(Register.this, "Error desconocido al registrar. Código: " + response.code(), Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Log.e(TAG, "Error: Respuesta no exitosa o cuerpo nulo. Código: " + response.code());
                    Toast.makeText(Register.this, "Error en el registro. Respuesta inesperada. Código: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<AuthResponse> call, @NonNull Throwable t) {
                Log.e(TAG, "FAILURE - Conexión fallida: " + t.getMessage(), t);
                Toast.makeText(Register.this, "🔴 Fallo de conexión. Revisa tu red o la URL base. Mensaje: " + t.getMessage(), Toast.LENGTH_LONG).show();
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
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
import com.example.switchstyle.R;
import com.example.switchstyle.ReiniciarContra;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class LoginActivity extends AppCompatActivity {

    EditText email, password;
    FirebaseAuth mAuth;
    FirebaseFirestore mFirestore;

    // Barra de navegación
    LinearLayout navHome, navRegister, navCatalogs;

    @Override
    protected void onStart() {
        super.onStart();
        mAuth = FirebaseAuth.getInstance();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        this.setTitle("Login");

        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();

        email = findViewById(R.id.username);
        password = findViewById(R.id.password);
        Button btn_login = findViewById(R.id.login);
        Button btn_forgot_password = findViewById(R.id.boton_recuperar);

        btn_login.setOnClickListener(view -> {
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();
            validarCamposYLoguear(emailUser, passUser);
        });

        btn_forgot_password.setOnClickListener(view ->
                startActivity(new Intent(LoginActivity.this, ReiniciarContra.class))
        );

        // 🔻 Inicializar barra de navegación
        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
            // Si tenés una pantalla Home personalizada, podrías dirigir allí
            Toast.makeText(this, "Ya estás en el Login", Toast.LENGTH_SHORT).show();
        });

        navRegister.setOnClickListener(v -> {
            // Redirigir al registro si querés implementarlo
            Toast.makeText(this, "Función de registro no implementada", Toast.LENGTH_SHORT).show();
        });

        navCatalogs.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, CatalogoProductos.class));
            finish();
        });
    }

    private void validarCamposYLoguear(String emailUser, String passUser) {
        if (TextUtils.isEmpty(emailUser) && TextUtils.isEmpty(passUser)) {
            Toast.makeText(this, "Por favor, completá todos los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        if (TextUtils.isEmpty(emailUser)) {
            Toast.makeText(this, "Falta ingresar el correo electrónico", Toast.LENGTH_SHORT).show();
            return;
        }

        if (TextUtils.isEmpty(passUser)) {
            Toast.makeText(this, "Falta ingresar la contraseña", Toast.LENGTH_SHORT).show();
            return;
        }

        loginUser(emailUser, passUser);
    }

    private void loginUser(String emailUser, String passUser) {
        mAuth.signInWithEmailAndPassword(emailUser, passUser)
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        FirebaseUser user = mAuth.getCurrentUser();
                        if (user != null) {
                            String userId = user.getUid();

                            mFirestore.collection("user").document(userId).get()
                                    .addOnSuccessListener(documentSnapshot -> {
                                        if (documentSnapshot.exists()) {
                                            String userName = documentSnapshot.getString("name");
                                            if (userName == null || userName.isEmpty()) {
                                                userName = "usuario";
                                            }

                                            Toast.makeText(this, "Bienvenido/a Switch Style " + userName, Toast.LENGTH_LONG).show();

                                            // 🔴 Redirigir a CatalogoProductos
                                            Intent intent = new Intent(LoginActivity.this, CatalogoProductos.class);
                                            intent.putExtra("userName", userName);
                                            startActivity(intent);
                                            finish();
                                        } else {
                                            Toast.makeText(this, "No se encontró información del usuario", Toast.LENGTH_SHORT).show();
                                        }
                                    })
                                    .addOnFailureListener(e ->
                                            Toast.makeText(this, "Error al obtener los datos del usuario", Toast.LENGTH_SHORT).show()
                                    );
                        }
                    } else {
                        Toast.makeText(this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                    }
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Error al iniciar sesión: " + e.getMessage(), Toast.LENGTH_SHORT).show()
                );
    }
}

package com.example.switchstyle.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.MainActivity;
import com.example.switchstyle.R;
import com.example.switchstyle.ReiniciarContra;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class LoginActivity extends AppCompatActivity {

    EditText email, password;
    FirebaseAuth mAuth;
    FirebaseFirestore mFirestore;

    @Override
    protected void onStart() {
        super.onStart();
        mAuth = FirebaseAuth.getInstance();  // Aseguramos inicialización
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

                            // Obtener nombre del usuario desde Firestore
                            mFirestore.collection("user").document(userId).get()
                                    .addOnSuccessListener(documentSnapshot -> {
                                        if (documentSnapshot.exists()) {
                                            String userName = documentSnapshot.getString("name");
                                            if (userName == null || userName.isEmpty()) {
                                                userName = "usuario";
                                            }

                                            // 🔽 Aquí está la modificación solicitada
                                            Toast.makeText(this, "Bienvenido/a Switch Style " + userName, Toast.LENGTH_LONG).show();

                                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
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

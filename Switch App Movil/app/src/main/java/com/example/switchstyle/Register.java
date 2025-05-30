package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Register extends AppCompatActivity {

    EditText name, email, password;
    FirebaseFirestore mFirestore;
    FirebaseAuth mAuth;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registro);
        this.setTitle("Registro");
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);

        mFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        name = findViewById(R.id.Nombre);
        email = findViewById(R.id.Email);
        password = findViewById(R.id.Contraseña);
        Button btn_register = findViewById(R.id.Button_registro);

        btn_register.setOnClickListener(btn_register1 -> {
            String nameUser = name.getText().toString().trim();
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();

            // Validaciones de campos faltantes con mensajes específicos
            if (TextUtils.isEmpty(nameUser) && TextUtils.isEmpty(emailUser) && TextUtils.isEmpty(passUser)) {
                Toast.makeText(Register.this, "Falta completar todos los campos", Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(nameUser)) {
                Toast.makeText(Register.this, "Falta ingresar el nombre", Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(emailUser)) {
                Toast.makeText(Register.this, "Falta ingresar el correo electrónico", Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(passUser)) {
                Toast.makeText(Register.this, "Falta ingresar la contraseña", Toast.LENGTH_SHORT).show();
            } else if (passUser.length() < 6) {
                // Validación de contraseña mínima de 6 caracteres
                Toast.makeText(Register.this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show();
            } else {
                // Si todo está bien, registrar el usuario
                registerUser(nameUser, emailUser, passUser);
            }
        });

        Button buttonIrALogin = findViewById(R.id.buttonIrALogin);
        buttonIrALogin.setOnClickListener(buttonIrLogin -> {
            Intent intent = new Intent(Register.this, LoginActivity.class);
            startActivity(intent);
        });
    }

    private void registerUser(String nameUser, String emailUser, String passUser) {
        mAuth.createUserWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                String userId = mAuth.getCurrentUser().getUid();

                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", userId);
                userMap.put("name", nameUser);
                userMap.put("email", emailUser);

                mFirestore.collection("user").document(userId).set(userMap)
                        .addOnSuccessListener(aVoid -> {
                            Toast.makeText(Register.this, "Usuario registrado con éxito", Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(Register.this, LoginActivity.class));
                            finish();
                        })
                        .addOnFailureListener(e -> Toast.makeText(Register.this, "Error al guardar el usuario: " + e.getMessage(), Toast.LENGTH_LONG).show());
            } else {
                // Detectar si la excepción es por usuario ya registrado
                String error = task.getException() != null ? task.getException().getMessage() : "";
                if (error.contains("The email address is already in use")) {
                    Toast.makeText(Register.this, "Ya existe una cuenta creada con este correo", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(Register.this, "Error al registrar el usuario: " + error, Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return false;
    }
}

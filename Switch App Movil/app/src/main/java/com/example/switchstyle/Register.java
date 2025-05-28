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

            // Verificamos si falta algún campo
            if (TextUtils.isEmpty(nameUser) || TextUtils.isEmpty(emailUser) || TextUtils.isEmpty(passUser)) {
                Toast.makeText(Register.this, "Complete todos los datos", Toast.LENGTH_SHORT).show();
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
        // Crear el usuario en Firebase Authentication
        mAuth.createUserWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                String userId = mAuth.getCurrentUser().getUid();

                // Crear el mapa con los datos del usuario
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", userId);
                userMap.put("name", nameUser);
                userMap.put("email", emailUser);

                // Guardar los datos del usuario en la colección 'user' con su UID como ID del documento
                mFirestore.collection("user").document(userId).set(userMap)
                        .addOnSuccessListener(aVoid -> {
                            // Mostrar mensaje de éxito
                            Toast.makeText(Register.this, "Usuario registrado con éxito", Toast.LENGTH_SHORT).show();

                            // Redirigir al login o a la actividad principal
                            startActivity(new Intent(Register.this, LoginActivity.class));
                            finish(); // Para que no se quede en el registro
                        })
                        .addOnFailureListener(e -> {
                            // Si ocurre un error al guardar en Firestore, mostrar el error
                            Toast.makeText(Register.this, "Error al guardar el usuario: " + e.getMessage(), Toast.LENGTH_LONG).show();
                        });
            } else {
                // Si falla la creación del usuario en Firebase Authentication
                Toast.makeText(Register.this, "Error al registrar el usuario: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return false;
    }
}

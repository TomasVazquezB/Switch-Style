package com.example.switchstyle;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
import com.google.firebase.auth.FirebaseAuth;

public class ReiniciarContra extends AppCompatActivity {

    private EditText editTextEmail;
    private FirebaseAuth mAuth;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_olvidocontra);

        mAuth = FirebaseAuth.getInstance();
        editTextEmail = findViewById(R.id.contraseña_recuperada);

        Button buttonRestablecerContraseña = findViewById(R.id.recuperar_contraseña);
        buttonRestablecerContraseña.setOnClickListener(v -> {
            String email = editTextEmail.getText().toString().trim();

            if (!email.isEmpty()) {
                mAuth.sendPasswordResetEmail(email)
                        .addOnCompleteListener(task -> {
                            if (task.isSuccessful()) {
                                Toast.makeText(ReiniciarContra.this, "Se ha enviado un correo para restablecer tu contraseña", Toast.LENGTH_SHORT).show();
                                startActivity(new Intent(ReiniciarContra.this, LoginActivity.class));
                                finish();
                            } else {
                                Toast.makeText(ReiniciarContra.this, "Error al enviar correo de recuperación", Toast.LENGTH_SHORT).show();
                            }
                        });
            } else {
                Toast.makeText(ReiniciarContra.this, "Ingrese su correo electrónico", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
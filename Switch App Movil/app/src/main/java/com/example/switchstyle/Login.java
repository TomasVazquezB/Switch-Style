package com.example.switchstyle;

import static android.content.Context.MODE_PRIVATE;
import static androidx.core.content.ContextCompat.startActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class Login {

    private SharedPreferences sharedPreferences;
    private EditText editTextEmail, editTextContraseña;

    public static Intent newIntent(com.example.switchstyle.ReiniciarContra ignoredReiniciarContra) {
        return null;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        editTextEmail = editTextEmail.findViewById(R.id.username);
        editTextContraseña = editTextContraseña.findViewById(R.id.password);
        sharedPreferences = getSharedPreferences("MisPreferencias", MODE_PRIVATE);
        final String emailAlmacenado = sharedPreferences.getString("email", "");
        final String contraseñaAlmacenada = sharedPreferences.getString("contraseña", "");

        Button buttonIniciarSesion = findViewById(R.id.login);
        buttonIniciarSesion.setOnClickListener(buttonIniciarSesion1 -> {
            String emailIngresado = editTextEmail.getText().toString().trim();
            String contraseñaIngresada = editTextContraseña.getText().toString().trim();

            if (emailIngresado.equals(emailAlmacenado) && contraseñaIngresada.equals(contraseñaAlmacenada)) {
                Toast.makeText(Login.this, "Inicio de sesión exitoso", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(Login.this, MainActivity.class));
                finish();
            } else {
                Toast.makeText(Login.this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
            }
        });

        Button buttonOlvidoContraseña = findViewById(R.id.boton_recuperar);
        buttonOlvidoContraseña.setOnClickListener(view -> startActivity(new Intent(Login.this, ReiniciarContra.class)));
    }
}
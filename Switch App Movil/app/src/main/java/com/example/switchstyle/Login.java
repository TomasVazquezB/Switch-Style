package com.example.switchstyle;

import static android.content.Context.MODE_PRIVATE;
import static androidx.core.content.ContextCompat.startActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class Login {

    private SharedPreferences sharedPreferences;
    private EditText editTextEmail, editTextContraseña;

    public static Intent newIntent(com.example.switchstyle.ReiniciarContra reiniciarContra) {
        return null;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio);
        editTextEmail = editTextEmail.findViewById(R.id.Email_Inicio);
        editTextContraseña = editTextContraseña.findViewById(R.id.Contraseña_inicio);
        sharedPreferences = getSharedPreferences("MisPreferencias", MODE_PRIVATE);
        final String emailAlmacenado = sharedPreferences.getString("email", "");
        final String contraseñaAlmacenada = sharedPreferences.getString("contraseña", "");

        Button buttonIniciarSesion = findViewById(R.id.buttonIniciarSesion);
        buttonIniciarSesion.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View buttonIniciarSesion) {
                String emailIngresado = editTextEmail.getText().toString().trim();
                String contraseñaIngresada = editTextContraseña.getText().toString().trim();

                if (emailIngresado.equals(emailAlmacenado) && contraseñaIngresada.equals(contraseñaAlmacenada)) {
                    Toast.makeText(Login.this, "Inicio de sesión exitoso", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(Login.this, com.example.switchstyle.MainActivity.class));
                    finish();
                } else {
                    Toast.makeText(Login.this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                }
            }
        });

        Button buttonOlvidoContraseña = findViewById(R.id.boton_recuperar);
        buttonOlvidoContraseña.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                startActivity(new Intent(Login.this, ReiniciarContra.class));
            }
        });
    }
}
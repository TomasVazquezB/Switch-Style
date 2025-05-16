// Login.java
package com.example.aplicacionbasica;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class Login extends AppCompatActivity {

    private SharedPreferences sharedPreferences;
    private EditText editTextEmail, editTextContraseña;

    public static Intent newIntent(ReiniciarContra reiniciarContra) {
        return null;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio);

        // Inicializar vistas
        editTextEmail = findViewById(R.id.Email_Inicio);  // Asegúrate de que el ID sea el correcto
        editTextContraseña = findViewById(R.id.Contraseña_inicio);  // Asegúrate de que el ID sea el correcto

        // Obtener los valores almacenados localmente
        sharedPreferences = getSharedPreferences("MisPreferencias", MODE_PRIVATE);
        final String emailAlmacenado = sharedPreferences.getString("email", "");
        final String contraseñaAlmacenada = sharedPreferences.getString("contraseña", "");

        Button buttonIniciarSesion = findViewById(R.id.buttonIniciarSesion);
        buttonIniciarSesion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View buttonIniciarSesion) {
                // Obtener los valores ingresados por el usuario
                String emailIngresado = editTextEmail.getText().toString().trim();
                String contraseñaIngresada = editTextContraseña.getText().toString().trim();

                if (emailIngresado.equals(emailAlmacenado) && contraseñaIngresada.equals(contraseñaAlmacenada)) {
                    // Inicio de sesión exitoso, redirigir a MainActivity
                    Toast.makeText(Login.this, "Inicio de sesión exitoso", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(Login.this, MainActivity.class));
                    finish();  // Cierra la actividad actual para evitar volver atrás con el botón de retroceso
                } else {
                    // Datos incorrectos, mostrar un mensaje de error
                    Toast.makeText(Login.this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Agregar código para el botón "Olvido su contraseña"
        Button buttonOlvidoContraseña = findViewById(R.id.boton_recuperar);
        buttonOlvidoContraseña.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Iniciar la actividad ReiniciarContra al hacer clic en el botón
                startActivity(new Intent(Login.this, ReiniciarContra.class));
            }
        });
    }

}

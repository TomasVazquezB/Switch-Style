package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

public class Login extends AppCompatActivity {

    private EditText editTextEmail, editTextContraseña;
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        editTextEmail = findViewById(R.id.username);
        editTextContraseña = findViewById(R.id.password);

        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();

        Button buttonIniciarSesion = findViewById(R.id.login);
        buttonIniciarSesion.setOnClickListener(buttonIniciarSesion1 -> {
            String emailIngresado = editTextEmail.getText().toString().trim();
            String contraseñaIngresada = editTextContraseña.getText().toString().trim();

            // Validación de los campos
            if (TextUtils.isEmpty(emailIngresado) && TextUtils.isEmpty(contraseñaIngresada)) {
                Toast.makeText(Login.this, "Falta ingresar el correo electrónico y la contraseña", Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(emailIngresado)) {
                Toast.makeText(Login.this, "Falta ingresar el correo electrónico", Toast.LENGTH_SHORT).show();
            } else if (TextUtils.isEmpty(contraseñaIngresada)) {
                Toast.makeText(Login.this, "Falta ingresar la contraseña", Toast.LENGTH_SHORT).show();
            } else {
                // Iniciar sesión con Firebase Authentication si los campos están completos
                mAuth.signInWithEmailAndPassword(emailIngresado, contraseñaIngresada)
                        .addOnCompleteListener(task -> {
                            if (task.isSuccessful()) {
                                // Si el inicio de sesión es exitoso
                                String userId = mAuth.getCurrentUser().getUid();

                                // Obtener el nombre del usuario desde Firestore
                                mFirestore.collection("user").document(userId).get()
                                        .addOnSuccessListener(documentSnapshot -> {
                                            if (documentSnapshot.exists()) {
                                                String userName = documentSnapshot.getString("name");

                                                // Pasar el nombre del usuario al MainActivity
                                                Intent intent = new Intent(Login.this, MainActivity.class);
                                                intent.putExtra("userName", userName); // Enviar el nombre al MainActivity
                                                startActivity(intent);
                                                finish();
                                            }
                                        })
                                        .addOnFailureListener(e -> {
                                            Toast.makeText(Login.this, "Error al obtener los datos del usuario", Toast.LENGTH_SHORT).show();
                                        });
                            } else {
                                // Si ocurre un error al iniciar sesión
                                Toast.makeText(Login.this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
                            }
                        });
            }
        });

        Button buttonOlvidoContraseña = findViewById(R.id.boton_recuperar);
        buttonOlvidoContraseña.setOnClickListener(view -> startActivity(new Intent(Login.this, ReiniciarContra.class)));
    }
}

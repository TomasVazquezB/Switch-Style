package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();

        // Verificar si el usuario está autenticado
        FirebaseUser currentUser = mAuth.getCurrentUser();

        // Si el usuario no está autenticado, redirigir al login y terminar esta actividad
        if (currentUser == null) {
            startActivity(new Intent(MainActivity.this, Login.class));
            finish(); // Para que no se quede en MainActivity
        } else {
            // Si el usuario está autenticado, proceder a obtener su nombre desde Firestore
            String userId = currentUser.getUid();
            mFirestore.collection("user").document(userId).get()
                    .addOnSuccessListener(documentSnapshot -> {
                        if (documentSnapshot.exists()) {
                            // Obtener el nombre del usuario de Firestore
                            String userName = documentSnapshot.getString("name");

                            // Mostrar el mensaje de bienvenida con el nombre en un Toast
                            if (userName != null) {
                                Toast.makeText(MainActivity.this, "Bienvenido/a " + userName + " a Switch Style", Toast.LENGTH_LONG).show();
                            } else {
                                Toast.makeText(MainActivity.this, "Bienvenido/a a Switch Style", Toast.LENGTH_LONG).show();
                            }
                        } else {
                            // Si no se encuentra el documento del usuario en Firestore
                            Toast.makeText(MainActivity.this, "Bienvenido/a a Switch Style", Toast.LENGTH_LONG).show();
                        }
                    })
                    .addOnFailureListener(e -> {
                        // Si ocurre un error al intentar obtener los datos del usuario
                        Toast.makeText(MainActivity.this, "Bienvenido/a a Switch Style", Toast.LENGTH_LONG).show();
                    });
        }

        // Acción del botón de registro (por si el usuario quiere registrarse)
        Button button = findViewById(R.id.button);
        button.setOnClickListener(button1 -> {
            Intent intent = new Intent(MainActivity.this, Register.class);
            startActivity(intent);
        });
    }
}

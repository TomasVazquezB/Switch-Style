package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;
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
            startActivity(new Intent(MainActivity.this, LoginActivity.class));
            finish(); // Para que no se quede en MainActivity
        } else {
            // Si el usuario está autenticado, se puede obtener su información desde Firestore si se necesita más adelante
            String userId = currentUser.getUid();
            mFirestore.collection("user").document(userId).get()
                    .addOnSuccessListener(documentSnapshot -> {
                        // Documento obtenido exitosamente (puede usarse más adelante)
                    })
                    .addOnFailureListener(e -> {
                        // Fallo al obtener datos del usuario (puede manejarse si es necesario)
                    });
        }

        // Acción del botón "comenzar" → ahora abre Register
        Button button = findViewById(R.id.button);
        button.setOnClickListener(button1 -> {
            Intent intent = new Intent(MainActivity.this, Register.class);
            startActivity(intent);
        });
    }
}

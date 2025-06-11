package com.example.switchstyle;

import android.os.Bundle;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        FirebaseFirestore mFirestore = FirebaseFirestore.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        if (currentUser != null) {
            String userId = currentUser.getUid();
            mFirestore.collection("user").document(userId).get()
                    .addOnSuccessListener(documentSnapshot -> {
                        String nombre = documentSnapshot.getString("name");
                        if (nombre != null && !nombre.isEmpty()) {
                        }
                    })
                    .addOnFailureListener(e -> {
                    });
        } else {
        }

        LinearLayout navHome = findViewById(R.id.nav_home);
        LinearLayout navRegister = findViewById(R.id.nav_register);
        LinearLayout navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
        });

        navRegister.setOnClickListener(v -> startActivity(new android.content.Intent(MainActivity.this, Register.class)));
        navCatalogs.setOnClickListener(v -> startActivity(new android.content.Intent(MainActivity.this, CatalogoProductos.class)));
    }
}

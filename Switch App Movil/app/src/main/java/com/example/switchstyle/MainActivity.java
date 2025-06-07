package com.example.switchstyle;

import android.os.Bundle;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    private LinearLayout navHome, navRegister, navCatalogs;

    private FirebaseAuth mAuth;
    private FirebaseUser currentUser;
    private FirebaseFirestore mFirestore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();
        currentUser = mAuth.getCurrentUser();

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

        navHome = findViewById(R.id.nav_home);
        navRegister = findViewById(R.id.nav_register);
        navCatalogs = findViewById(R.id.nav_catalogs);

        navHome.setOnClickListener(v -> {
        });

        navRegister.setOnClickListener(v -> {
            startActivity(new android.content.Intent(MainActivity.this, Register.class));
        });

        navCatalogs.setOnClickListener(v -> {
            startActivity(new android.content.Intent(MainActivity.this, CatalogoProductos.class));
        });
    }
}

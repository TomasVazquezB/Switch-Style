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

            if (nameUser.isEmpty() && emailUser.isEmpty() && passUser.isEmpty()){
                Toast.makeText(Register.this, "Complete los datos", Toast.LENGTH_SHORT).show();
            }else{
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
        mFirestore.collection("user").whereEqualTo("name", nameUser)
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        if (task.getResult().isEmpty()) {
                            mFirestore.collection("user").whereEqualTo("email", emailUser)
                                    .get()
                                    .addOnCompleteListener(task2 -> {
                                        if (task2.isSuccessful()) {
                                            if (task2.getResult().isEmpty()) {
                                                mAuth.createUserWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(task1 -> {
                                                    if (task1.isSuccessful()) {
                                                        String id = mAuth.getCurrentUser().getUid();
                                                        Map<String, Object> map = new HashMap<>();
                                                        map.put("id", id);
                                                        map.put("name", nameUser);
                                                        map.put("email", emailUser);
                                                        map.put("password", passUser);
                                                        mFirestore.collection("user").document(id).set(map).addOnSuccessListener(unused -> Toast.makeText(Register.this, "Registro exitoso", Toast.LENGTH_SHORT).show()).addOnFailureListener(e -> Toast.makeText(Register.this, "Error al registrar", Toast.LENGTH_SHORT).show());
                                                    }
                                                });
                                            } else {
                                                Toast.makeText(Register.this, "El correo electrónico ya existe", Toast.LENGTH_SHORT).show();
                                            }
                                        } else {
                                            Toast.makeText(Register.this, "Error al verificar el correo electrónico", Toast.LENGTH_SHORT).show();
                                        }
                                    });
                        } else {
                            Toast.makeText(Register.this, "El nombre de usuario ya existe", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(Register.this, "Error al verificar el nombre de usuario", Toast.LENGTH_SHORT).show();
                    }
                });
    }
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return false;
    }
}
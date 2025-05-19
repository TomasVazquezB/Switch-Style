package com.example.switchstyle.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.aplicacionbasica.R;
import com.example.switchstyle.MainActivity;
import com.example.switchstyle.ReiniciarContra;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class LoginActivity extends AppCompatActivity {

    EditText email, password;
    FirebaseAuth mAuth;

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseUser user = mAuth.getCurrentUser();
    }
//            startActivity(new Intent(LoginActivity.this, LoginActivity.class));
//            finish();
//        }
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        this.setTitle("Login");

        mAuth = FirebaseAuth.getInstance();
        email = findViewById(R.id.username);
        password = findViewById(R.id.password);
        Button btn_login = findViewById(R.id.login);
        Button btn_forgot_password = findViewById(R.id.boton_recuperar);

        btn_login.setOnClickListener(view -> {
            String emailUser = email.getText().toString().trim();
            String passUser = password.getText().toString().trim();
            loginUser(emailUser, passUser);
        });



        btn_forgot_password.setOnClickListener(view -> startActivity(new Intent(LoginActivity.this, ReiniciarContra.class)));
    }

    private void loginUser(String emailUser, String passUser) {
        if (emailUser.isEmpty() || passUser.isEmpty()){
            Toast.makeText(LoginActivity.this, "Por favor, ingresa tus datos de acceso.", Toast.LENGTH_SHORT).show();
        } else {
            mAuth.signInWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(task -> {
                if (task.isSuccessful()){
                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                    finish();
                    Toast.makeText(LoginActivity.this, "Bienvenido a PetPalms", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(LoginActivity.this, "Los datos ingresados son incorrectos.", Toast.LENGTH_SHORT).show();
                }
            }).addOnFailureListener(e -> Toast.makeText(LoginActivity.this, "Error al iniciar sesión: " + e.getMessage(), Toast.LENGTH_SHORT).show());
        }
    }


}

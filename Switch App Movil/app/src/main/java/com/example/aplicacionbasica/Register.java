package com.example.aplicacionbasica;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.example.aplicacionbasica.ui.login.LoginActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import java.util.HashMap;
import java.util.Map;

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
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        mFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        name = findViewById(R.id.Nombre);
        email = findViewById(R.id.Email);
        password = findViewById(R.id.Contraseña);
        Button btn_register = findViewById(R.id.Button_registro);


        btn_register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View btn_register) {
                String nameUser = name.getText().toString().trim();
                String emailUser = email.getText().toString().trim();
                String passUser = password.getText().toString().trim();

                if (nameUser.isEmpty() && emailUser.isEmpty() && passUser.isEmpty()){
                    Toast.makeText(Register.this, "Complete los datos", Toast.LENGTH_SHORT).show();
                }else{
                    registerUser(nameUser, emailUser, passUser);

                }
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
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            if (task.getResult().isEmpty()) {
                                mFirestore.collection("user").whereEqualTo("email", emailUser)
                                        .get()
                                        .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                            @Override
                                            public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                                if (task.isSuccessful()) {
                                                    if (task.getResult().isEmpty()) {
                                                        mAuth.createUserWithEmailAndPassword(emailUser, passUser).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                                                            @Override
                                                            public void onComplete(@NonNull Task<AuthResult> task) {
                                                                if (task.isSuccessful()) {
                                                                    String id = mAuth.getCurrentUser().getUid();
                                                                    Map<String, Object> map = new HashMap<>();
                                                                    map.put("id", id);
                                                                    map.put("name", nameUser);
                                                                    map.put("email", emailUser);
                                                                    map.put("password", passUser);
                                                                    mFirestore.collection("user").document(id).set(map).addOnSuccessListener(new OnSuccessListener<Void>() {
                                                                        @Override
                                                                        public void onSuccess(Void unused) {
                                                                            Toast.makeText(Register.this, "Registro exitoso", Toast.LENGTH_SHORT).show();
                                                                        }
                                                                    }).addOnFailureListener(new OnFailureListener() {
                                                                        @Override
                                                                        public void onFailure(@NonNull Exception e) {
                                                                            Toast.makeText(Register.this, "Error al registrar", Toast.LENGTH_SHORT).show();
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        Toast.makeText(Register.this, "El correo electrónico ya existe", Toast.LENGTH_SHORT).show();
                                                    }
                                                } else {
                                                    Toast.makeText(Register.this, "Error al verificar el correo electrónico", Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                            } else {
                                Toast.makeText(Register.this, "El nombre de usuario ya existe", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(Register.this, "Error al verificar el nombre de usuario", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return false;
    }
}

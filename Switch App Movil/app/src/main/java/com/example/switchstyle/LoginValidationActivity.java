package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class LoginValidationActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_validation);
        setTitle("Acceso restringido");

        Button btnIrLogin = findViewById(R.id.btnIrRegistro);
        btnIrLogin.setOnClickListener(v -> {
            startActivity(new Intent(LoginValidationActivity.this, LoginActivity.class));
            finish();
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(LoginValidationActivity.this, MainActivity.class));
        finish();
    }
}

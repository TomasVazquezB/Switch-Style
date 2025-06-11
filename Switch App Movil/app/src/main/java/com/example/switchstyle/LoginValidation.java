package com.example.switchstyle;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.example.switchstyle.ui.login.LoginActivity;

public class LoginValidation extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_validation);

        Button btnIrRegistro = findViewById(R.id.btnIrRegistro);

        btnIrRegistro.setOnClickListener(v -> startActivity(new Intent(this, LoginActivity.class)));
    }
}

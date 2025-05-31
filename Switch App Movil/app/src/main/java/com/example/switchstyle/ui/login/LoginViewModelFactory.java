package com.example.switchstyle.ui.login;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import com.example.switchstyle.data.LoginDataSource;
import com.example.switchstyle.data.LoginRepository;

public class LoginViewModelFactory implements ViewModelProvider.Factory {

    @com.example.switchstyle.ui.login.NonNull
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(LoginViewModel.class)) {
            return (T) new LoginViewModel(LoginRepository.getInstance(new LoginDataSource()));
        } else {
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }
}
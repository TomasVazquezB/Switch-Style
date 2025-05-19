package com.example.switchstyle.data;

import com.example.switchstyle.data.model.LoggedInUser;

import java.io.IOException;

public class LoginDataSource {

    public Result<LoggedInUser> login(String ignoredUsername, String ignoredPassword) {

        try {
            LoggedInUser fakeUser = new LoggedInUser(java.util.UUID.randomUUID().toString(),"");
            return new Result.Success<>(fakeUser);
        } catch (Exception e) {
            return new Result.Error(new IOException("Error logging in", e));
        }
    }

    public void logout() {

    }
}
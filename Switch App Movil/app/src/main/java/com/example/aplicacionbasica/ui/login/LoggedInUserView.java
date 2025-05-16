package com.example.aplicacionbasica.ui.login;

class LoggedInUserView {
    private String displayName;

    LoggedInUserView(String displayName) {
        this.displayName = displayName;
    }

    String getDisplayName() {
        return displayName;
    }
}
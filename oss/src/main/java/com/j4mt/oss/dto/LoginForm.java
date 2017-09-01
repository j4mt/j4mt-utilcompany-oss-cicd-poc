package com.j4mt.oss.dto;

import com.j4mt.oss.entity.User;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class LoginForm {

    @NotNull
    @Size(min = 1, max = 255)
    @Pattern(regexp = User.EMAIL_PATTERN, message = "{emailPatternError}")
    private String username;

    @NotNull
    @Size(min = 1, max = 30)
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {

        return "LoginForm [username=" + username + ", password=" + password + "]";
    }
}

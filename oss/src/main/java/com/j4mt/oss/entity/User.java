package com.j4mt.oss.entity;

import com.j4mt.oss.util.MyUtil;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "USER", indexes = {
        @Index(columnList = "email", unique = true),
        @Index(columnList = "forgotPasswordCode", unique = true)
})
public class User {

    public static final int EMAIL_MAX = 250;
    public static final int NAME_MAX = 50;
    public static final String EMAIL_PATTERN = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    public static final int RANDOM_CODE_LENGTH = 16;
    public static final int PASSWORD_MAX = 30;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, length = EMAIL_MAX)
    private String email;
    @Column(nullable = false, length = NAME_MAX)
    private String name;
    // no length because it will be encrypted
    @Column(nullable = false)
    private String password;
    @Column(length = 16)
    private String verificationCode;
    @Column(length = RANDOM_CODE_LENGTH)
    private String forgotPasswordCode;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<Role>();
    @OneToMany(mappedBy = "user")
    private List<MeterRead> meterReads;

    public String getForgotPasswordCode() {
        return forgotPasswordCode;
    }

    public void setForgotPasswordCode(String forgotPasswordCode) {
        this.forgotPasswordCode = forgotPasswordCode;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return roles.contains(Role.ADMIN);
    }

    public boolean isEditable() {
        User loggedIn = MyUtil.getSessionUser();
        if (loggedIn == null)
            return false;
        return loggedIn.isAdmin() ||   // ADMIN or
                loggedIn.getId() == id; // self can edit
    }

    public enum Role {
        UNVERIFIED, BLOCKED, ADMIN
    }

}

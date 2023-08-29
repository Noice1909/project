package com.example.demo.model;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "UserAuth")
public class UserAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
    @NotNull
    private Customer customer;

    @NotNull
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @NotNull
    @Column(name = "password")
    private String password;

    // Constructors
    public UserAuth() {
        customer = null;
        password = "";
        username = "";
    }

    public UserAuth(Long userId, @NotNull Customer customer, @NotNull String username, @NotNull String password) {
        this.userId = userId;
        this.customer = customer;
        this.username = username;
        this.password = password;
    }
    //Getter and Setter

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public @NotNull Customer getCustomer() {
        return customer;
    }

    public void setCustomer(@NotNull Customer customer) {
        this.customer = customer;
    }

    public @NotNull String getUsername() {
        return username;
    }

    public void setUsername(@NotNull String username) {
        this.username = username;
    }

    public @NotNull String getPassword() {
        return password;
    }

    public void setPassword(@NotNull String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserAuth{" +
                "userId=" + userId +
                ", customer=" + customer +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

package com.example.demo.model;

import jakarta.persistence.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "ContactUs")
public class ContactUs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contactus_id")
    private Long contactusId;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "email")
    @Email
    @NotNull
    private String email;

    @Column(name = "message")
    @NotNull
    @Size(max = 500)
    private String message;

    @Column(name = "status")
    @NotNull
    private String status;

    public ContactUs() {
        this.status = "active";
    }

    public ContactUs(Long contactusId, String name, String email, String message) {
        this.contactusId = contactusId;
        this.name = name;
        this.email = email;
        this.message = message;
        this.status = "active";
    }

    public Long getContactusId() {
        return contactusId;
    }

    public void setContactusId(Long contactusId) {
        this.contactusId = contactusId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}


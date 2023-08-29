package com.example.demo.model;

import jakarta.persistence.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "Withdrawal")
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "withdrawal_id")
    @NotNull
    private Long withdrawalId;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "account_id")
    @NotNull
    private Account account;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
    @NotNull
    private Customer customer;

    @Column(name = "withdrawal_amount")
    @NotNull
    private BigDecimal withdrawalAmount;

    @Column(name = "status" , length = 20)
    @NotNull
    private String status;

    //Constructor

    public Withdrawal() {
    }

    public Withdrawal(Account account, Customer customer, BigDecimal withdrawalAmount) {
        this.account = account;
        this.customer = customer;
        this.withdrawalAmount = withdrawalAmount;
        this.status = "pending";
    }

    public Withdrawal(Long withdrawalId, Account account, Customer customer, BigDecimal withdrawalAmount) {
        this.withdrawalId = withdrawalId;
        this.account = account;
        this.customer = customer;
        this.withdrawalAmount = withdrawalAmount;
        this.status = "pending";
    }



    public Long getWithdrawalId() {
        return withdrawalId;
    }

    public void setWithdrawalId(Long withdrawalId) {
        this.withdrawalId = withdrawalId;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BigDecimal getWithdrawalAmount() {
        return withdrawalAmount;
    }

    public void setWithdrawalAmount(BigDecimal withdrawalAmount) {
        this.withdrawalAmount = withdrawalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

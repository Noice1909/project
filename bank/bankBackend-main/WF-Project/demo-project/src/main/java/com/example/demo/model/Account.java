package com.example.demo.model;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "Account")
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "account_id")
	private Long accountId;

	@ManyToOne
	@JoinColumn(name = "customer_id" , referencedColumnName="customer_id")
	@NotNull
	private Customer customer;

	@Column(name = "account_type")
	@NotNull
	private String accountType;

	@NotNull
	private BigDecimal balance;

	@NotNull
	@Column(name = "status")
	private String status;

	//Constructor

	public Account() {
		customer = null;
		accountType = null;
		balance = BigDecimal.valueOf(0);
		status = null;
	}

	public Account(@NotNull Customer customer, @NotNull String accountType, @NotNull BigDecimal balance, @NotNull String status) {
		this.customer = customer;
		this.accountType = accountType;
		this.balance = balance;
		this.status = status;
	}

	public Account(long accountId, @NotNull Customer customer, @NotNull String accountType, @NotNull BigDecimal balance, @NotNull String status) {
		this.accountId = accountId;
		this.customer = customer;
		this.accountType = accountType;
		this.balance = balance;
		this.status = status;
	}

	// Getters and setters
	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public @NotNull Customer getCustomer() {
		return customer;
	}

	public void setCustomer(@NotNull Customer customer) {
		this.customer = customer;
	}

	public @NotNull String getAccountType() {
		return accountType;
	}

	public void setAccountType(@NotNull String accountType) {
		this.accountType = accountType;
	}

	public @NotNull BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(@NotNull BigDecimal balance) {
		this.balance = balance;
	}

	public @NotNull String getStatus() {
		return status;
	}

	public void setStatus(@NotNull String status) {
		this.status = status;
	}
}

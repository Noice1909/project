package com.example.demo.model;

import jakarta.persistence.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Transaction")
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "transaction_id")
	private Long transactionId;

	@ManyToOne
	@JoinColumn(name = "account_id")
	@NotNull
	private Account account;
	@NotNull
	@Column(name ="description")
	private String description;

	@Column(name = "transaction_type")
	@NotNull
	private String transactionType;

	@NotNull
	@Column(name = "amount")
	private BigDecimal amount;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "transaction_date")
	private @NotNull Date transactionDate;

	@NotNull
	private BigDecimal balance;

	//Constructor

	public Transaction() {
		account = null;
		transactionType = null;
		amount = null;
		transactionDate = null;
	}

	public Transaction(Long transactionId, @NotNull Account account, @NotNull String transactionType, @NotNull BigDecimal amount, @NotNull Date transactionDate,@NotNull String description,@NotNull BigDecimal balance) {
		this.transactionId = transactionId;
		this.account = account;
		this.transactionType = transactionType;
		this.amount = amount;
		this.transactionDate = transactionDate;
		this.description = description;
		this.balance = balance;
	}

	//Getter and Setter

	public Long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(Long transactionId) {
		this.transactionId = transactionId;
	}

	public @NotNull Account getAccount() {
		return account;
	}

	public void setAccount(@NotNull Account account) {
		this.account = account;
	}

	public @NotNull String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(@NotNull String transactionType) {
		this.transactionType = transactionType;
	}

	public @NotNull BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(@NotNull BigDecimal amount) {
		this.amount = amount;
	}

	public @NotNull Date getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(@NotNull Date transactionDate) {
		this.transactionDate = transactionDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public void setAmountWithSign(@NotNull BigDecimal amount, @NotNull String transactionType) {
		if ("deducted".equalsIgnoreCase(transactionType)) {
			this.amount = amount.negate();
		} else { //credited
			this.amount = amount;
		}
	}
}

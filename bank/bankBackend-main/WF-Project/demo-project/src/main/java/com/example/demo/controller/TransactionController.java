package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private TransactionRepository transactionRepository;

	@GetMapping("/transactions")
	public List<Transaction> getAllTransactions() {
		return transactionRepository.findAll();
	}

	@PostMapping("/transactions")
	public Transaction createTransaction(@Validated @RequestBody Transaction newTransaction) {
		return transactionRepository.save(newTransaction);
	}

	@PutMapping("/transactions/{id}")
	public ResponseEntity<Transaction> updateTransaction(@PathVariable(value = "id") Long transactionId,
														 @Validated @RequestBody Transaction updatedTransaction) throws ResourceNotFoundException {
		Transaction transaction = transactionRepository.findById(transactionId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found for this id :: " + transactionId));

		transaction.setAccount(updatedTransaction.getAccount());
		transaction.setTransactionType(updatedTransaction.getTransactionType());
		transaction.setAmount(updatedTransaction.getAmount());
		transaction.setTransactionDate(updatedTransaction.getTransactionDate());

		transactionRepository.save(transaction);

		return ResponseEntity.ok(transaction);
	}

	@DeleteMapping("/transactions/{id}")
	public Map<String, Boolean> deleteTransaction(@PathVariable(value = "id") Long transactionId) throws ResourceNotFoundException {
		Transaction transaction = transactionRepository.findById(transactionId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found for this id :: " + transactionId));

		transactionRepository.delete(transaction);
		Map<String, Boolean> response = new HashMap<>();
		response.put("Transaction has been Deleted", Boolean.TRUE);
		return response;
	}
	@GetMapping("/transactions/{customerId}")
	public List<Transaction> getTransactionsByCustomerId(@PathVariable Long customerId) {
		return transactionRepository.findByAccount_Customer_CustomerId(customerId);
	}
	@PostMapping("/process")
	public ResponseEntity<Map<String, Object>> processTransaction(@RequestBody Map<String, Object> requestBody) {

		// Extract senderAccountId, receiverAccountId, and amount from the request body
		Long senderAccountId = ((Number) requestBody.get("senderAccountId")).longValue();
		Long receiverAccountId = ((Number) requestBody.get("receiverAccountId")).longValue();
		BigDecimal amount = new BigDecimal(requestBody.get("amount").toString());

		// Fetch sender account by senderAccountId
		Account senderAccount = accountRepository.findById(senderAccountId).orElse(null);

		// Fetch receiver account by receiverAccountId
		Account receiverAccount = accountRepository.findById(receiverAccountId).orElse(null);
		Map<String, Object> response = new HashMap<>();
		// Check if sender or receiver account is missing
		if (senderAccount == null || receiverAccount == null) {
			response.put("success",false);
			response.put("message","Invalid account(s).");
			return ResponseEntity.ok(response);
		}
		//senders active status is active or not
		if(!senderAccount.getStatus().equals("active")){
			response.put("success",false);
			response.put("message","It seems your account status is not active. Please contact branch if it is a mistake.");
			return ResponseEntity.ok(response);
		}
		//receiver's active status is active or not
		if(!receiverAccount.getStatus().equals("active")){
			response.put("success",false);
			response.put("message","Receiver's account is not active.");
			return ResponseEntity.ok(response);
		}
		//Check both account number are different
		if(senderAccount == receiverAccount){
			response.put("success",false);
			response.put("message","Can not send in your own account");
			return ResponseEntity.ok(response);
		}
		//Can not send 0 amount
		if(amount.compareTo(BigDecimal.ZERO)==0){
			response.put("success",false);
			response.put("message","Can not send 0 $");
			return ResponseEntity.ok(response);
		}
		// Check if sender's balance is sufficient for the transaction
		BigDecimal senderBalance = senderAccount.getBalance();
		if (senderBalance.compareTo(amount) < 0) {
			response.put("success",false);
			response.put("message","Insufficient balance.");
			return ResponseEntity.ok(response);
		}

		// Deduct amount from sender's account balance and add to receiver's account balance
		senderAccount.setBalance(senderBalance.subtract(amount));
		receiverAccount.setBalance(receiverAccount.getBalance().add(amount));

		// Save updated balances in the account repository
		accountRepository.save(senderAccount);
		accountRepository.save(receiverAccount);

		// Create a new Transaction object and save it in the transaction repository
		Transaction SenderTransaction = new Transaction();
		SenderTransaction.setAccount(senderAccount);
		SenderTransaction.setTransactionType(requestBody.get("transactionType").toString());
		SenderTransaction.setAmountWithSign(amount,"deducted");
		SenderTransaction.setTransactionDate(new Date());
		SenderTransaction.setDescription("send $ "+ amount + " to account number "+ receiverAccountId);
		SenderTransaction.setBalance(senderAccount.getBalance());
		transactionRepository.save(SenderTransaction);

		Transaction receiverTransaction = new Transaction();
		receiverTransaction.setAccount(receiverAccount);
		receiverTransaction.setTransactionType(requestBody.get("transactionType").toString());
		receiverTransaction.setAmountWithSign(amount,"credited");
		receiverTransaction.setTransactionDate(new Date());
		receiverTransaction.setDescription("received $ "+ amount +" from account number "+ senderAccountId);
		receiverTransaction.setBalance(receiverAccount.getBalance());
		transactionRepository.save(receiverTransaction);

		response.put("success",true);
		response.put("message","Transaction Successful");
		// Return success response
		return ResponseEntity.ok(response);
	}
//	@PostMapping("/withdrawal")
//	public ResponseEntity<Map<String, Object>> withdrawalTransaction(@RequestBody Map<String, Object> requestBody){
//		Map<String, Object> response = new HashMap<>();
//
//		Long selfAccountId = ((Number) requestBody.get("selfAccountId")).longValue();
//		BigDecimal amount = new BigDecimal(requestBody.get("amount").toString());
//
//		Account selfAccount = accountRepository.findById(selfAccountId).orElse(null);
//		Transaction withdrawal = new Transaction();
//		withdrawal.setAccount(selfAccount);
//		withdrawal.getBalance(selfAccount.getBalance())
//
//		return ResponseEntity.ok(response);
//	}
}

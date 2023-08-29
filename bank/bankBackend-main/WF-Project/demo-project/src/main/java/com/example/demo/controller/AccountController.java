package com.example.demo.controller;

import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Account;
import com.example.demo.repository.AccountRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private CustomerRepository customerRepository;

	@GetMapping("/accounts")
	public List<Account> getAllAccounts() {
		return accountRepository.findAll();
	}

	@PostMapping("/accounts")
	public ResponseEntity<Map<String, Object>> createAccount(@Validated @RequestBody Account newAccount) {
		Map<String, Object> response = new HashMap<>();
			Account createdAccount = accountRepository.save(newAccount);
			response.put("success", true);
			response.put("message", "Account created successfully");
			response.put("account", createdAccount);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/accounts/{id}")
	public ResponseEntity<Account> updateAccount(@PathVariable(value = "id") Long accountId,
												 @Validated @RequestBody Account updatedAccount) throws ResourceNotFoundException {
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found for this id :: " + accountId));

		account.setCustomer(updatedAccount.getCustomer());
		account.setAccountType(updatedAccount.getAccountType());
		account.setBalance(updatedAccount.getBalance());
		account.setStatus(updatedAccount.getStatus());
		accountRepository.save(account);

		return ResponseEntity.ok(account);
	}
	@PutMapping("/accounts/{id}/status")
	public ResponseEntity<Account> updateAccountStatus(@PathVariable(value = "id") Long accountId,
													   @Validated @RequestBody String newStatus) throws ResourceNotFoundException {
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found for this id :: " + accountId));

		account.setStatus(newStatus);
		accountRepository.save(account);

		return ResponseEntity.ok(account);
	}

	@DeleteMapping("/accounts/{id}")
	public Map<String, Boolean> deleteAccount(@PathVariable(value = "id") Long accountId) throws ResourceNotFoundException {
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new ResourceNotFoundException("Account not found for this id :: " + accountId));

		accountRepository.delete(account);
		Map<String, Boolean> response = new HashMap<>();
		response.put("Account has been Deleted", Boolean.TRUE);
		return response;
	}
	@GetMapping("/by-customer/{customerId}")
	public List<Account> getAccountsByCustomer(@PathVariable Long customerId) {
		Customer customer = customerRepository.findById(customerId).orElse(null);

		if (customer == null) {
			return null;
		}

		return accountRepository.findByCustomer(customer);
	}
}

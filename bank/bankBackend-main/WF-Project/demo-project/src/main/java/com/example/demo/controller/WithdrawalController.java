package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.model.UserAuth;
import com.example.demo.model.Withdrawal;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserAuthRepository;
import com.example.demo.repository.WithdrawalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("api/withdraw")
@CrossOrigin(origins = "http://localhost:3000")
public class WithdrawalController {

    @Autowired
    private WithdrawalRepository withdrawalRepository;
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserAuthRepository userAuthRepository;

    @GetMapping("/withdrawal")
    public List<Withdrawal> getAllWithdrawals() {
        return withdrawalRepository.findAll();
    }

    @PostMapping("/withdrawal")
    public ResponseEntity<Map<String, Object>> createAccount(@Validated @RequestBody Withdrawal newWithdrawal) {
        Map<String, Object> response = new HashMap<>();
        Withdrawal createdWithdrawal = withdrawalRepository.save(newWithdrawal);
        response.put("success", true);
        response.put("message", "Account created successfully");
        response.put("withdrawal", createdWithdrawal);

        return ResponseEntity.ok(response);
    }
    @PutMapping("/withdrawal/{id}")
    public ResponseEntity<Map<String, Object>> updateWithdrawal(@PathVariable(value = "id") Long withdrawalId,
                                                 @Validated @RequestBody Withdrawal updatedWithdrawal) throws ResourceNotFoundException {
        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal not found for this id :: " + withdrawalId));
        Map<String, Object> response = new HashMap<>();
        if(updatedWithdrawal.getStatus().equals("accepted")){
            Long accountId = updatedWithdrawal.getAccount().getAccountId();
//            Transaction withdrawalTransaction = new Transaction();
//            withdrawalTransaction.setAccount(updatedWithdrawal.getAccount());
//            withdrawalTransaction.setTransactionDate(new Date());
//            withdrawalTransaction.setTransactionType("withdrawal");
//            withdrawalTransaction.setDescription("Withdraw "+ updatedWithdrawal.getWithdrawalAmount());
            Optional<Account> accountOptional = accountRepository.findById(accountId);
            if (accountOptional.isPresent()) {
                Account account = accountOptional.get();
                BigDecimal withdrawalAmount = updatedWithdrawal.getWithdrawalAmount();
                BigDecimal currentBalance = account.getBalance();

                if (currentBalance.compareTo(withdrawalAmount) >= 0) {

                    BigDecimal newBalance = currentBalance.subtract(withdrawalAmount);
                    account.setBalance(newBalance);
                    accountRepository.save(account);
                    Transaction transaction = new Transaction();
                    transaction.setAccount(account);
                    transaction.setTransactionType("withdraw");
                    transaction.setAmountWithSign(withdrawalAmount,"deducted");
                    transaction.setTransactionDate(new Date());
                    transaction.setDescription("withdraw $ "+ withdrawalAmount );
                    transaction.setBalance(account.getBalance());
                    transactionRepository.save(transaction);
                    withdrawal.setStatus(updatedWithdrawal.getStatus());
                    withdrawalRepository.save(withdrawal);
                    response.put("success",true);
                    response.put("withdrawal",withdrawal);
                    return ResponseEntity.ok(response);
                }
            }
        }
        System.out.println("here");
        withdrawal.setStatus(updatedWithdrawal.getStatus());
        withdrawalRepository.save(withdrawal);
        response.put("success",true);
        response.put("withdrawal",withdrawal);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/withdrawal/{id}/status")
    public ResponseEntity<Withdrawal> updateWithdrawalStatus(@PathVariable(value = "id") Long withdrawalId,
                                                       @Validated @RequestBody String newStatus) throws ResourceNotFoundException {
        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal not found for this id :: " + withdrawalId));

        withdrawal.setStatus(newStatus);
        withdrawalRepository.save(withdrawal);

        return ResponseEntity.ok(withdrawal);
    }
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> requestWithdrawal(
            @RequestBody Withdrawal withdrawalRequest,
            @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();

        Account account = accountRepository.findById(withdrawalRequest.getAccount().getAccountId()).orElse(null);

        if (account == null) {
            response.put("success", false);
            response.put("message", "Invalid account");
            return ResponseEntity.ok(response);
        }

        BigDecimal accountBalance = account.getBalance();
        BigDecimal withdrawalAmount = withdrawalRequest.getWithdrawalAmount();

        if (withdrawalAmount.compareTo(BigDecimal.ZERO) <= 0 || withdrawalAmount.compareTo(accountBalance) > 0) {
            response.put("success", false);
            response.put("message", "Invalid withdrawal amount or insufficient funds");
            return ResponseEntity.ok(response);
        }

        // Retrieve user authentication details
        UserAuth user = userAuthRepository.findByCustomer_CustomerId(withdrawalRequest.getCustomer().getCustomerId());

        if (user == null || !user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.ok(response);
        }

        // Deduct the withdrawal amount from the account and update the balance
        // account.setBalance(accountBalance.subtract(withdrawalAmount));
        // accountRepository.save(account);

        // Create and save the withdrawal transaction
         Withdrawal withdrawalTransaction = new Withdrawal(account, withdrawalRequest.getCustomer(), withdrawalAmount);
        withdrawalRepository.save(withdrawalTransaction);
        Long withdrawalId = withdrawalTransaction.getWithdrawalId();
        response.put("success", true);
        response.put("message", "Withdrawal request successful");
        response.put("referenceNumber",withdrawalId);
        return ResponseEntity.ok(response);
    }

}



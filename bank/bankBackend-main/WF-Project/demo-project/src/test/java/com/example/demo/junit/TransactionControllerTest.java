package com.example.demo.junit;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.example.demo.controller.TransactionController;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.model.Transaction;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountRepository accountRepository;

    @MockBean
    private TransactionRepository transactionRepository;

    @Test
    public void testGetAllTransactions() throws Exception {
        List<Transaction> transactions = new ArrayList<>();
        Customer customer1 = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account newAccount1 = new Account(customer1, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount1 = new Account(3L, customer1, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Transaction newTransaction1 = new Transaction(null,createdAccount1,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction createdTransaction1 = new Transaction(1L,createdAccount1,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));

        Customer customer2 = new Customer(2L, "Jack Torson", "jack@example.com", "9087654321", "321 Main St", "NY", "Regionland", "12345","Active");
        Account newAccount2 = new Account(customer2, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount2 = new Account(4L, customer2, "Savings", BigDecimal.valueOf(3000), "ACTIVE");
        Transaction newTransaction2 = new Transaction(null,createdAccount2,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction createdTransaction2 = new Transaction(2L,createdAccount2,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));

        transactions.add(createdTransaction1);
        transactions.add(createdTransaction2);

        when(transactionRepository.findAll()).thenReturn(transactions);

        mockMvc.perform(get("/api/transaction/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(transactions.size()));
    }

    @Test
    public void testCreateTransaction() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account newAccount = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Transaction newTransaction = new Transaction(null,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction createdTransaction = new Transaction(1L,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));

        when(transactionRepository.save(any(Transaction.class))).thenReturn(createdTransaction);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/transaction/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(newTransaction)))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateTransactionById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account newAccount = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Transaction newTransaction = new Transaction(null,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction existingTransaction = new Transaction(1L,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction updatedTransaction = new Transaction(1L,createdAccount,"RTGS",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));

        when(transactionRepository.findById(anyLong())).thenReturn(Optional.of(existingTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(updatedTransaction);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/transaction/transactions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(updatedTransaction)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(updatedTransaction.getAmount()));
    }

//    @Test
//    public void testGetTransactionById() throws Exception {
//        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345");
//        Account newAccount = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
//        Account createdAccount = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
//        Transaction newTransaction = new Transaction(null,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date());
//        Transaction existingTransaction = new Transaction(1L,createdAccount,"NEFT",BigDecimal.valueOf(500),new Date());
//
//        when(transactionRepository.findById(1L)).thenReturn(Optional.of(existingTransaction));
//
//        mockMvc.perform(get("/api/v1/transactions/1")) // Replace 1 with the actual transaction ID
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.transactionType").value("NEFT"));
//    }

    @Test
    public void testDeleteTransactionById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account newAccount = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Transaction newTransaction = new Transaction(null,createdAccount,"RTGS",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));
        Transaction existingTransaction = new Transaction(1L,createdAccount,"RTGS",BigDecimal.valueOf(500),new Date(),"Transaction is successful", BigDecimal.valueOf(2000));

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(existingTransaction));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/transaction/transactions/1"))
                .andExpect(status().isOk());
        verify(transactionRepository, times(1)).delete(existingTransaction);
    }

    // Test other methods...

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}


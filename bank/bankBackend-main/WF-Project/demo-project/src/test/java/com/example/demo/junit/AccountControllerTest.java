package com.example.demo.junit;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.demo.controller.AccountController;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.CustomerRepository;
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
@WebMvcTest(AccountController.class)
public class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountRepository accountRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @Test
    public void testGetAllAccounts() throws Exception {
        List<Account> accounts = new ArrayList<>();
        // Add account instances to the list
        Customer customer1 = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account account1 = new Account(3L, customer1, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Customer customer2 = new Customer(2L, "Jack Torson", "jack@example.com", "9087654321", "321 Main St", "NY", "Regionland", "12345", "Active");
        Account account2 = new Account(4L, customer2, "Savings", BigDecimal.valueOf(3000), "ACTIVE");
        accounts.add(account1);
        accounts.add(account2);
        when(accountRepository.findAll()).thenReturn(accounts);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/account/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(accounts.size()));
    }

    @Test
    public void testCreateAccount() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account newAccount = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Account createdAccount = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");

        when(accountRepository.save(any(Account.class))).thenReturn(createdAccount);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/account/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(newAccount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.account.accountType").value(createdAccount.getAccountType()));
    }

    @Test
    public void testUpdateAccountById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account existingAccount = new Account(1L, customer, "Savings", BigDecimal.valueOf(1500), "ACTIVE");
        Account updatedAccount = new Account(1L, customer, "Savings", BigDecimal.valueOf(1800), "ACTIVE");

        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(existingAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(updatedAccount);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/account/accounts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(updatedAccount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(updatedAccount.getBalance()));
    }

    @Test
    public void testUpdateAccountStatusById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account existingAccount = new Account(1L, customer, "Savings", BigDecimal.valueOf(1500), "ACTIVE");
        String newStatus = "INACTIVE";

        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(existingAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(existingAccount);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/account/accounts/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newStatus))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(newStatus));
    }

    @Test
    public void testDeleteAccount() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account existingAccount = new Account(1L, customer, "Savings", BigDecimal.valueOf(1500), "ACTIVE");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(existingAccount));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/account/accounts/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk());

        verify(accountRepository, times(1)).delete(existingAccount);
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

package com.example.demo.junit;

import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.model.Withdrawal;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.UserAuthRepository;
import com.example.demo.repository.WithdrawalRepository;
import com.example.demo.repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.example.demo.controller.WithdrawalController;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@WebMvcTest(WithdrawalController.class)
public class WithdrawalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WithdrawalRepository withdrawalRepository;

    @MockBean
    private AccountRepository accountRepository;

    @MockBean
    private UserAuthRepository userAuthRepository;

    @MockBean
    private  TransactionRepository transactionRepository;

//    @InjectMocks
//    private WithdrawalController withdrawalController;


    @Test
    public void testGetAllWithdrawals() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345","Active");
        Account account = new Account(3L, customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Withdrawal withdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(500));
        List<Withdrawal> withdrawalList = new ArrayList<>();
        withdrawalList.add(withdrawal);

        when(withdrawalRepository.findAll()).thenReturn(withdrawalList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/withdraw/withdrawal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(withdrawalList.size()));
    }

    @Test
    public void testCreateWithdrawal() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account account = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Withdrawal withdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(500));

        Mockito.when(withdrawalRepository.save(Mockito.any(Withdrawal.class))).thenReturn(withdrawal);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/withdraw/withdrawal")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(withdrawal)))
                .andExpect(MockMvcResultMatchers.status().isOk());
        // Add more assertions based on your implementation
    }

    @Test
    public void testUpdateWithdrawal() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account account = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Withdrawal existingWithdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(500));
        Withdrawal updatedWithdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(200));

        Mockito.when(withdrawalRepository.findById(1L)).thenReturn(Optional.of(existingWithdrawal));
        Mockito.when(withdrawalRepository.save(Mockito.any(Withdrawal.class))).thenReturn(updatedWithdrawal);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/withdraw/withdrawal/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(updatedWithdrawal)))
                .andExpect(MockMvcResultMatchers.status().isOk());
        // Add more assertions based on your implementation
    }
    @Test
    void testUpdateWithdrawalStatus() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account account = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");
        Withdrawal existingWithdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(500));
        Withdrawal updatedWithdrawal = new Withdrawal(1L, account, customer, BigDecimal.valueOf(200));

        when(withdrawalRepository.findById(anyLong())).thenReturn(Optional.of(existingWithdrawal));
        when(withdrawalRepository.save(any(Withdrawal.class))).thenReturn(updatedWithdrawal);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/withdraw/withdrawal/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("completed"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("completed"));
    }

    @Test
    public void testRequestWithdrawal() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Account account = new Account(customer, "Savings", BigDecimal.valueOf(2000), "ACTIVE");

        when(accountRepository.findById(anyLong())).thenReturn(java.util.Optional.of(account));
        when(userAuthRepository.findByCustomer_CustomerId(anyLong())).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/withdraw/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"account\": {\"accountId\": 1}, \"customer\": {\"customerId\": 1}, \"withdrawalAmount\": 500}")
                        .param("password", "password"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(false));
    }

    private String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}



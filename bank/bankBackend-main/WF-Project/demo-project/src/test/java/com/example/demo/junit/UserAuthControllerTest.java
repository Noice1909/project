package com.example.demo.junit;

import com.example.demo.controller.UserAuthController;
import com.example.demo.model.Customer;
import com.example.demo.model.UserAuth;
import com.example.demo.repository.UserAuthRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserAuthControllerTest {

    @Mock
    private UserAuthRepository userAuthRepository;

    @InjectMocks
    private UserAuthController userAuthController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userAuthController).build();
    }

    @Test
    void testGetAllUserAuths() throws Exception {
        Customer customer1 = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        Customer customer2 = new Customer(2L, "Jack Torson", "jack@example.com", "9087654321", "123 Main St", "NY", "Regionland", "12345", "Active");
        UserAuth user1 = new UserAuth(1L, customer1, "user1", "password1");
        UserAuth user2 = new UserAuth(2L, customer2, "user2", "password2");
        List<UserAuth> userAuthList = Arrays.asList(user1, user2);

        when(userAuthRepository.findAll()).thenReturn(userAuthList);

        mockMvc.perform(get("/api/user/user-auth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[1].userId").value(2));
    }

    @Test
    void testCreateUserAuth() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        UserAuth newUserAuth = new UserAuth(1L, customer, "johndoe", "password");

        when(userAuthRepository.save(any(UserAuth.class))).thenReturn(newUserAuth);

        mockMvc.perform(post("/api/user/user-auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":1,\"customer\":{\"customerId\":1,\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"address\":\"123 Main St\",\"city\":\"Cityville\",\"region\":\"Regionland\",\"postalCode\":\"12345\",\"role\":\"customer\"},\"username\":\"johndoe\",\"password\":\"password\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("UserAuth created successfully"))
                .andExpect(jsonPath("$.userAuth.userId").value(newUserAuth.getUserId()));
    }

    @Test
    void testUpdateUserAuthById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        UserAuth existingUserAuth = new UserAuth(1L, customer, "existinguser", "oldpassword");
        UserAuth updatedUserAuth = new UserAuth(1L, customer, "updateduser", "newpassword");

        when(userAuthRepository.findById(anyLong())).thenReturn(Optional.of(existingUserAuth));
        when(userAuthRepository.save(any(UserAuth.class))).thenReturn(updatedUserAuth);

        mockMvc.perform(put("/api/user/user-auth/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":1,\"customer\":{\"customerId\":1,\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"address\":\"123 Main St\",\"city\":\"Cityville\",\"region\":\"Regionland\",\"postalCode\":\"12345\",\"role\":\"customer\"},\"username\":\"updateduser\",\"password\":\"newpassword\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(updatedUserAuth.getUserId()))
                .andExpect(jsonPath("$.username").value(updatedUserAuth.getUsername()))
                .andExpect(jsonPath("$.password").value(updatedUserAuth.getPassword()));
    }

    @Test
    void testDeleteUserAuthById() throws Exception {
        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
        UserAuth newUserAuth = new UserAuth(1L, customer, "johndoe", "password");

        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(newUserAuth));

        mockMvc.perform(delete("/api/user/user-auth/1"))
                .andExpect(status().isOk());
        verify(userAuthRepository, times(1)).delete(newUserAuth);
    }

//    @Test
//    void testValidateLogin() throws Exception {
//        Customer customer = new Customer(1L, "John Doe", "john@example.com", "1234567890", "123 Main St", "Cityville", "Regionland", "12345", "Active");
//        UserAuth user = new UserAuth(1L, customer, "johndoe", "password");
//
//        when(userAuthRepository.findByUsername(anyString())).thenReturn(user);
//
//        mockMvc.perform(post("/api/v1/user-auth-login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"userId\":1,\"customer\":{\"customerId\":1,\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"address\":\"123 Main St\",\"city\":\"Cityville\",\"region\":\"Regionland\",\"postalCode\":\"12345\",\"role\":\"customer\"},\"username\":\"johndoe\",\"password\":\"password\"}")
//                        .accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Login successfully"))
//                .andExpect(jsonPath("$.userAuthData.userId").value(user.getUserId()));
//    }
}
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.UserAuth;
import com.example.demo.repository.UserAuthRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {

    @Autowired
    private UserAuthRepository userAuthRepository;

    @GetMapping("/user-auth")
    public List<UserAuth> getAllUserAuths() {
        return userAuthRepository.findAll();
    }

    @PostMapping("/user-auth")
    public ResponseEntity<Map<String, Object>> createUserAuth(@Validated @RequestBody UserAuth newUserAuth) {

        UserAuth existingUserAuth = userAuthRepository.findByUsername(newUserAuth.getUsername());
        if (existingUserAuth != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("username",true);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        UserAuth createdUserAuth = userAuthRepository.save(newUserAuth);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("username",false);
        response.put("message", "UserAuth created successfully");
        response.put("userAuth", createdUserAuth);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/user-auth/username-check")
    public boolean usernameCheck(@Validated @RequestBody String username){
        UserAuth user = userAuthRepository.findByUsername(username);
        return user!=null;
    }
    @PutMapping("/user-auth/{id}")
    public ResponseEntity<UserAuth> updateUserAuth(@PathVariable(value = "id") Long userId,
                                                   @Validated @RequestBody UserAuth updatedUserAuth) throws ResourceNotFoundException {
        UserAuth userAuth = userAuthRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAuth not found for this id :: " + userId));

        userAuth.setCustomer(updatedUserAuth.getCustomer());
        userAuth.setUsername(updatedUserAuth.getUsername());
        userAuth.setPassword(updatedUserAuth.getPassword());

        userAuthRepository.save(userAuth);

        return ResponseEntity.ok(userAuth);
    }

    @DeleteMapping("/user-auth/{id}")
    public Map<String, Boolean> deleteUserAuth(@PathVariable(value = "id") Long userId) throws ResourceNotFoundException {
        UserAuth userAuth = userAuthRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAuth not found for this id :: " + userId));

        userAuthRepository.delete(userAuth);
        Map<String, Boolean> response = new HashMap<>();
        response.put("UserAuth has been Deleted", Boolean.TRUE);
        return response;
    }

    @PostMapping("/user-auth-login")
    public ResponseEntity<Map<String, Object>> validateLogin(@Validated @RequestBody UserAuth loginIDPass) {
        UserAuth userAuth = userAuthRepository.findByUsername(loginIDPass.getUsername());
        Map<String, Object> response = new HashMap<>();
        if(userAuth == null){
            response.put("success",false);
            response.put("message","Username does not exist");
        }
        else{
            if(userAuth.getCustomer().getStatus().equals("disabled")){
                response.put("success",false);
                response.put("message","This Customer account is disabled. You think its a mistake please contact bank.");
            } else if (userAuth.getUsername().equals(loginIDPass.getUsername()) && userAuth.getPassword().equals(loginIDPass.getPassword())) {
                response.put("success",true);
                response.put("message","Authorised login.");
                response.put("userAuthData",userAuth);
            }else {
                response.put("success",false);
                response.put("message","Username and Password don't match");
            }
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-customers/{customerId}")
    public ResponseEntity<Map<String,Object>> getUserByCustomerId(@PathVariable Long customerId) {
        UserAuth user = userAuthRepository.findByCustomer_CustomerId(customerId);
        Map<String,Object> response= new HashMap<>();
        if (user == null) {
            response.put("success",false);
            response.put("message","User Noy Found");
            return  ResponseEntity.ok(response);
        }

        response.put("success",true);
        response.put("message","User Found");
        response.put("user",user);
        return ResponseEntity.ok(response);
    }
}

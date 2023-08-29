package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.ContactUs;
import com.example.demo.model.Customer;
import com.example.demo.repository.ContactUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/contact-us")
public class ContactUsController {
    @Autowired
    private ContactUsRepository contactUsRepository;

    @GetMapping("/contact")
    public List<ContactUs> getAllContactUs(){return contactUsRepository.findAll();}

    @GetMapping("/contact/{id}")
    public ResponseEntity<ContactUs> getContactUsById(@PathVariable(value = "id") Long contactusId) throws ResourceNotFoundException{
        ContactUs contactUs = contactUsRepository.findById(contactusId)
                .orElseThrow(()->new ResourceNotFoundException("No ContactUs found for this id :: " + contactusId));
        return ResponseEntity.ok(contactUs);
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> createContactUs(@Validated @RequestBody ContactUs newContactUs) {
        newContactUs.setStatus("active");
        ContactUs savedContactUs = contactUsRepository.save(newContactUs);
        System.out.println("inside the controller");
        System.out.println(newContactUs);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Message sent successfully");
        response.put("customer", savedContactUs);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/contact/{id}")
    public ResponseEntity<ContactUs> updateCustomer(@PathVariable(value = "id") Long contactusId,
                                                   @Validated @RequestBody ContactUs updatedContactUs) throws ResourceNotFoundException {
        ContactUs contactUs = contactUsRepository.findById(contactusId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found for this id :: " + contactusId));


        // Set other fields you want to update
        contactUs.setStatus(updatedContactUs.getStatus());
        contactUs.setEmail(updatedContactUs.getEmail());
        contactUs.setMessage(updatedContactUs.getMessage());
        contactUsRepository.save(contactUs);
        return ResponseEntity.ok(contactUs);
    }
}

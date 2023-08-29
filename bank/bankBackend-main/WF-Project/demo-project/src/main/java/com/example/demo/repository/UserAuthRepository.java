package com.example.demo.repository;

import com.example.demo.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Account;

@Repository
@EnableJpaRepositories
public interface UserAuthRepository extends JpaRepository<UserAuth, Long>{

    UserAuth findByUsername(String username);

    UserAuth findByCustomer_CustomerId(Long customerId);
}
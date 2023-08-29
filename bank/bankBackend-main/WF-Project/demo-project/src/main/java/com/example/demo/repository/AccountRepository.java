package com.example.demo.repository;

import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Account;

import java.util.List;


@EnableJpaRepositories
@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{

    List<Account> findByCustomer(Customer customer);
}
package com.example.demo.repository;
import com.example.demo.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {

}
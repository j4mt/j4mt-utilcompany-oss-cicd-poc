package com.j4mt.oss.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.j4mt.oss.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByEmail(String email);

	User findByForgotPasswordCode(String forgotPasswordCode);

}

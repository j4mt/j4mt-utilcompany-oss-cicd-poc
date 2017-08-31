package com.j4mt.oss.repositorie;

import org.springframework.data.jpa.repository.JpaRepository;

import com.j4mt.oss.entitie.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByEmail(String email);

	User findByForgotPasswordCode(String forgotPasswordCode);

}

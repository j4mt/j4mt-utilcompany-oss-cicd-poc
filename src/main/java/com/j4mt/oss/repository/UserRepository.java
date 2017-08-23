package com.j4mt.oss.repository;

import com.j4mt.oss.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByEmail(String email);

	User findByForgotPasswordCode(String forgotPasswordCode);

}

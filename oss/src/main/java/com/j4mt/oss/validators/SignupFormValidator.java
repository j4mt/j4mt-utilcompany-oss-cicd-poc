package com.j4mt.oss.validators;

import javax.annotation.Resource;

import com.j4mt.oss.dto.SignupForm;
import com.j4mt.oss.repositorie.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import com.j4mt.oss.entitie.User;

@Component
public class SignupFormValidator extends LocalValidatorFactoryBean {
	
	private UserRepository userRepository;
	
	@Resource
	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public boolean supports(Class<?> clazz) {
		return clazz.isAssignableFrom(SignupForm.class);
	}

	@Override
	public void validate(Object obj, Errors errors, final Object... validationHints) {
		
		super.validate(obj, errors, validationHints);
		
		if (!errors.hasErrors()) {
			SignupForm signupForm = (SignupForm) obj;
			User user = userRepository.findByEmail(signupForm.getEmail());
			if (user != null)
				errors.rejectValue("email", "emailNotUnique");			
		}
		
	}

}

package com.j4mt.oss.service;

import com.j4mt.oss.dto.ForgotPasswordForm;
import com.j4mt.oss.dto.SignupForm;
import com.j4mt.oss.dto.UserEditForm;
import org.springframework.validation.BindingResult;

import com.j4mt.oss.dto.ResetPasswordForm;
import com.j4mt.oss.model.User;

public interface UserService {
	
	public abstract void signup(SignupForm signupForm);

	public abstract void verify(String verificationCode);

	public abstract void forgotPassword(ForgotPasswordForm forgotPasswordForm);

	public abstract void resetPassword(String forgotPasswordCode,
			ResetPasswordForm resetPasswordForm, BindingResult result);

	public abstract User findOne(long userId);

	public abstract void update(long userId, UserEditForm userEditForm);

}

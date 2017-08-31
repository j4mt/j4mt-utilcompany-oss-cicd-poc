package com.j4mt.oss.service;

import com.j4mt.oss.dto.ForgotPasswordForm;
import com.j4mt.oss.dto.ResetPasswordForm;
import com.j4mt.oss.dto.SignupForm;
import com.j4mt.oss.dto.UserEditForm;
import com.j4mt.oss.entity.User;
import org.springframework.validation.BindingResult;

public interface UserService {

	void signup(SignupForm signupForm);

	void verify(String verificationCode);

	void forgotPassword(ForgotPasswordForm forgotPasswordForm);

	void resetPassword(String forgotPasswordCode,
					   ResetPasswordForm resetPasswordForm, BindingResult result);

	User findOne(long userId);

	void update(long userId, UserEditForm userEditForm);

}

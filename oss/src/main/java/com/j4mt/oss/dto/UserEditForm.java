package com.j4mt.oss.dto;

import com.j4mt.oss.entity.User;
import com.j4mt.oss.entity.User.Role;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

public class UserEditForm {
	
	@NotNull
	@Size(min=1, max=User.NAME_MAX, message="{nameSizeError}")
	private String name = "";
	
	private Set<Role> roles;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
	
}

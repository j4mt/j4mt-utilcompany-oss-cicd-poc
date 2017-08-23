package com.j4mt.oss.model;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

public class UserTest {

    @Test
    public void testUser_GetEmail() {

        User user = new User();
        user.setEmail("a@b.c");

        assertThat(user.getEmail(), is(notNullValue()));
    }
}

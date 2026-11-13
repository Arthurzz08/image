package io.spring.image.demo.application.users;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
}
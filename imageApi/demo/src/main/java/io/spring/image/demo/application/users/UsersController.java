package io.spring.image.demo.application.users;

import io.spring.image.demo.domain.AccessToken;
import io.spring.image.demo.domain.entity.User;
import io.spring.image.demo.domain.exception.DuplicatedTupleException;
import io.spring.image.demo.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UsersController {

    private final UserService service;

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody UserDTO dto) {
        if (isBlank(dto.getName()) || isBlank(dto.getEmail()) || isBlank(dto.getPassword())) {
            return ResponseEntity.badRequest().build();
        }

        User user = User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .password(dto.getPassword())
                .build();

        try {
            service.save(user);
        } catch (DuplicatedTupleException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/auth")
    public ResponseEntity<AccessToken> authenticate(@RequestBody CredentialsDTO credentials) {
        if (isBlank(credentials.getEmail()) || isBlank(credentials.getPassword())) {
            return ResponseEntity.badRequest().build();
        }

        AccessToken token = service.autenticate(
                credentials.getEmail().trim().toLowerCase(),
                credentials.getPassword());

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(token);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
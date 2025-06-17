package com.service.quickblog.controller;

import com.service.quickblog.dto.UserDTO;
import com.service.quickblog.repository.UserRepository;
import com.service.quickblog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/get/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id){
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id,@Valid @RequestBody UserDTO user) { 
        if (userRepository.existsByUsername(user.getUsername())) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        } 
        return ResponseEntity.ok(userService.updateUser(id,user));
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUserAccount(userId);
            return new ResponseEntity<>("User account and all associated data deleted successfully.", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); 
        }
    }
}

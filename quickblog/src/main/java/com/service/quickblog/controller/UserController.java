package com.service.quickblog.controller;

import com.service.quickblog.dto.UserDTO;
import com.service.quickblog.repository.UserRepository;
import com.service.quickblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserDTO user) { 
        if (userRepository.existsByUsername(user.getUsername())) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        } 
        return ResponseEntity.ok(userService.updateUser(id,user));
    }
}

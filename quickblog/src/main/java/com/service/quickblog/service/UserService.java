package com.service.quickblog.service;

import com.service.quickblog.dto.UserDTO;
import com.service.quickblog.model.User;
import com.service.quickblog.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public User mapDTOtoUser(UserDTO userDTO){
        return modelMapper.map(userDTO,User.class);
    }
    public UserDTO mapUsertoDTO(User user){
        return modelMapper.map(user,UserDTO.class);
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = mapDTOtoUser(userDTO);
        User savedUser = userRepository.save(user);
        return mapUsertoDTO(savedUser);
    }
    public UserDTO getUser(String id) {
        User user=userRepository.findById(id).orElseThrow(()->new RuntimeException("user not found"));
        return mapUsertoDTO(user);
    }
    public UserDTO updateUser(String id,UserDTO newUser) {     
        User user=userRepository.findById(id).orElseThrow(()->new RuntimeException("user not found"));
        user.setFullname(newUser.getFullname());
        user.setUsername(newUser.getUsername());
        User savedUser=  userRepository.save(user);
        return mapUsertoDTO(savedUser);
    }
}

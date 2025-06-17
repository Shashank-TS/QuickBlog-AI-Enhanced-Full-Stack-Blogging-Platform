package com.service.quickblog.service;

import com.service.quickblog.dto.UserDTO;
import com.service.quickblog.model.Blog;
import com.service.quickblog.model.User;
import com.service.quickblog.repository.BlogRepository;
import com.service.quickblog.repository.CommentsRepository;
import com.service.quickblog.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  BlogRepository blogRepository;

    @Autowired
    private CommentsRepository commentRepository;

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

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    /**
     * @param userId The ID of the user to delete.
     * @throws RuntimeException if the user is not found.
     */
    @Transactional 
    public void deleteUserAccount(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User userToDelete = userOptional.get();

        // Find and delete all comments associated with the user's blogs
        List<Blog> userBlogs = blogRepository.findByUserId(userId);
        if (!userBlogs.isEmpty()) {
            for (Blog blog : userBlogs) {
                commentRepository.deleteByBlogId(blog.getId());
            }
        } else {
            System.out.println("No blogs found for user: "+ userId);
        }

        // delete blogs
        blogRepository.deleteByUserId(userId);
        // delete user
        userRepository.delete(userToDelete);
    }
}

package com.service.quickblog.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.service.quickblog.dto.BlogDTO;
import com.service.quickblog.model.Blog;
import com.service.quickblog.service.BlogService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @PostMapping("/create")
    public ResponseEntity<BlogDTO> createBlog(@Valid @RequestBody BlogDTO blogDTO){
        return ResponseEntity.ok(blogService.createBlog(blogDTO));
    }

    @GetMapping("/get")
    public ResponseEntity<List<Blog>> getBlogs(){
        return ResponseEntity.ok(blogService.getBlogs());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BlogDTO> getBlogById(@PathVariable String id){
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/user/get/{userId}")
    public ResponseEntity<List<Blog>> getBlogByUserId(@PathVariable String userId){
        return ResponseEntity.ok(blogService.getBlogByUserId(userId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BlogDTO> updateBlog(@PathVariable String id,@Valid @RequestBody BlogDTO blog){
        return ResponseEntity.ok(blogService.updateBlog(id,blog));
    }

    @PutMapping("/setpublish/{id}")
    public ResponseEntity<String> setPublish(@PathVariable String id,@RequestBody BlogDTO blog){
        boolean publishStatus = blog.getisPublished();
        return ResponseEntity.ok(blogService.setPublish(id,publishStatus));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBlog(@PathVariable String id){
        return ResponseEntity.ok(blogService.deleteBlog(id));
    }

}

package com.service.quickblog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.service.quickblog.dto.SummarizeBlogRequest;
import com.service.quickblog.dto.generateBlogRequest;
import com.service.quickblog.service.AIService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/summarize")
    public ResponseEntity<?> summarizeBlog(@Valid @RequestBody SummarizeBlogRequest request){
        return ResponseEntity.ok(aiService.SummarizeBlog(request));
    }
    @PostMapping("/generateblog")
    public ResponseEntity<?> generateBlog(@Valid @RequestBody generateBlogRequest request){
        return ResponseEntity.ok(aiService.generateBlog(request));
    }
    
}

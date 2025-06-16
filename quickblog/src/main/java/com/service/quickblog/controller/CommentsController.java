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
import com.service.quickblog.dto.CommentDTO;
import com.service.quickblog.dto.CommentResponseDTO;
import com.service.quickblog.model.Comment;
import com.service.quickblog.service.CommentsService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comment")
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @GetMapping("/get/{blogId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String blogId){
        return ResponseEntity.ok(commentsService.getComments(blogId));
    }

    @PostMapping("/post")
    public ResponseEntity<CommentDTO> create(@Valid @RequestBody CommentDTO commentDTO){
        return ResponseEntity.ok(commentsService.create(commentDTO));
    }

    @GetMapping("/get/user/{userId}")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsbyUserId(@PathVariable String userId){
        return ResponseEntity.ok(commentsService.getCommentsByUserId(userId));
    }

    @PutMapping("/setapprove/{id}")
    public ResponseEntity<String> setApprove(@PathVariable String id){
        return ResponseEntity.ok(commentsService.setApprove(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable String id){
        return ResponseEntity.ok(commentsService.deleteComment(id));
    }
}

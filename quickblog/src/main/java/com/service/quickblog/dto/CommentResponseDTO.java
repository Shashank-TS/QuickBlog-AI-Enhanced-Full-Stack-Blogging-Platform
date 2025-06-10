package com.service.quickblog.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {

    private String id;
    private String name;
    private String content;
    private boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String blogTitle;
    
}

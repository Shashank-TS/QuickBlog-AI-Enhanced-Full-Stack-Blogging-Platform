package com.service.quickblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    private String id;
    private String name;
    private String content;
    private boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String blogId;
}

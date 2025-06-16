package com.service.quickblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    private String id;
    @NotBlank
    private String name;
    @NotBlank
    private String content;
    private boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @NotNull
    private String blogId;
}

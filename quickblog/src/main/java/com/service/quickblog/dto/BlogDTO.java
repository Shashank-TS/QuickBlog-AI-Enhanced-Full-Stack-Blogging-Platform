package com.service.quickblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {

    private String id;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String category;
    private String image;
    private boolean isPublished;
    @NotBlank
    private String subTitle;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @NotNull
    private String userId;
    private String userName;

    private List<String> commentIds;

    public boolean getisPublished(){
        return isPublished;
    }
}

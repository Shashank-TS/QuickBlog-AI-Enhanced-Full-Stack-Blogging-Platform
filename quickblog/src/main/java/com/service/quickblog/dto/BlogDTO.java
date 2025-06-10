package com.service.quickblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {

    private String id;
    private String title;
    private String description;
    private String category;
    private String image;
    private boolean isPublished;
    private String subTitle;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String userId;
    private String userName;

    private List<String> commentIds;

    public boolean getisPublished(){
        return isPublished;
    }
}

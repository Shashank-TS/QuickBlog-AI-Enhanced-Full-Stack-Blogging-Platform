package com.service.quickblog.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "subscribers")
@Data
public class Subscriber {
    @Id
    private String id; 

    @Indexed(unique = true) 
    private String email;

    private String userId;

    @CreatedDate
    private LocalDateTime subscribedAt; 

    public Subscriber(String email,String userId) {
        this.email = email;
        this.userId=userId;
        this.subscribedAt = LocalDateTime.now();
    }
}
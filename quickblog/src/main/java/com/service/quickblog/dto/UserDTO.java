package com.service.quickblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private String id;
    private String fullname;
    private String username;
    private String password;
    private List<String> blogIds;
}

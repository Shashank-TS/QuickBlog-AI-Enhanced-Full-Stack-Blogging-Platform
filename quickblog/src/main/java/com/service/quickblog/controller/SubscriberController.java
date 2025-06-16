package com.service.quickblog.controller;

import lombok.Data; 
import lombok.AllArgsConstructor;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.service.quickblog.service.SubscriberService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@RestController
@RequestMapping("/api")
public class SubscriberController {

    @Autowired
    private SubscriberService subscriberService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody EmailSubscriptionRequest request) {
        if (request.getEmail() == null || !request.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$")) { 
            return new ResponseEntity<>(new ApiResponse("Invalid email format."), HttpStatus.BAD_REQUEST);
        }
        try {
            subscriberService.subscribeEmail(request.getEmail(),request.getUserId());
            return new ResponseEntity<>(new ApiResponse("Subscription successful!"), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()), HttpStatus.CONFLICT); 
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("An error occurred during subscription."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribeEmail(@Valid @RequestBody EmailSubscriptionRequest request){
        try {
            subscriberService.unsubscribeEmail(request.getEmail());
            return new ResponseEntity<>(new ApiResponse("unSubscribe successful!"), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()), HttpStatus.CONFLICT); 
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("An error occurred during unsubscribe."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/subscriptionstatus/{email}")
    public ResponseEntity<?> subscriptionStatus(@PathVariable String email) {
    Map<String, Boolean> response = new HashMap<>(); 
    boolean status = subscriberService.subscriptionStatus(email); 
    response.put("status", status); 
    return ResponseEntity.ok(response);
    }
    

    
    @Data
    public static class EmailSubscriptionRequest {
        @NotNull
        private String userId;
        @NotBlank
        private String email;
    }

    @Data
    @AllArgsConstructor
    public static class ApiResponse {
        private String message;
    }
}

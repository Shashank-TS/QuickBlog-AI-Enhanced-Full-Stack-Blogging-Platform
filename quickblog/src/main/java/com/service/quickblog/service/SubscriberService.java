package com.service.quickblog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.service.quickblog.model.Subscriber;
import com.service.quickblog.repository.SubscriberRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriberService {

    @Autowired
    private SubscriberRepository subscriberRepository;

    public Subscriber subscribeEmail(String email,String userId) {
        if (subscriberRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already subscribed.");
        }
        Subscriber newSubscriber = new Subscriber(email,userId);
        return subscriberRepository.save(newSubscriber);
    }

    public List<String> getAllSubscriberEmails() {
        return subscriberRepository.findAll()
                                   .stream()
                                   .map(Subscriber::getEmail)
                                   .toList(); 
    }

    public boolean unsubscribeEmail(String email) {
        Optional<Subscriber> subscriberOptional = subscriberRepository.findByEmail(email);
        if (subscriberOptional.isPresent()) {
            subscriberRepository.delete(subscriberOptional.get());
            return true; 
        } else {
            return false; 
        }
    }
    public boolean subscriptionStatus(String email){
        if(subscriberRepository.existsByEmail(email)){
            return true;
        }
        return false;
    }
} 

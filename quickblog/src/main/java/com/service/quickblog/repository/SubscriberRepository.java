package com.service.quickblog.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.service.quickblog.model.Subscriber;
import java.util.Optional;
import java.util.List;

@Repository
public interface SubscriberRepository extends MongoRepository<Subscriber, String> {
    Optional<Subscriber> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Subscriber> findAll(); 
}
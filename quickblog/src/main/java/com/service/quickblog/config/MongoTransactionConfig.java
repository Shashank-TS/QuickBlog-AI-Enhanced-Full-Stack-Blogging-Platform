package com.service.quickblog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement // Enable Spring's transaction management capabilities
public class MongoTransactionConfig {

    // You can inject MongoDatabaseFactory directly
    // or MongoTemplate if you prefer for the transaction manager construction.
    // For simplicity and common use, MongoDatabaseFactory is standard here.

    @Bean
    public PlatformTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        // MongoTransactionManager requires a MongoDatabaseFactory
        // This bean makes @Transactional work with MongoDB operations
        return new MongoTransactionManager(dbFactory);
    }
}

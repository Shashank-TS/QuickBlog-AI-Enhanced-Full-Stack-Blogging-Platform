package com.service.quickblog.repository;

import com.service.quickblog.model.Blog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends MongoRepository<Blog,String> {

    List<Blog> findByUserId(String userId);

    void deleteByUserId(String userId);
}

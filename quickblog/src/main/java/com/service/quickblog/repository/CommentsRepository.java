package com.service.quickblog.repository;

import com.service.quickblog.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface CommentsRepository extends MongoRepository<Comment,String> {

    List<Comment> findByBlogId(String blogId);

    List<Comment> findByBlogIdIn(List<String> blogIds);

}

package com.service.quickblog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.service.quickblog.dto.CommentDTO;
import com.service.quickblog.dto.CommentResponseDTO;
import com.service.quickblog.model.Blog;
import com.service.quickblog.model.Comment;
import com.service.quickblog.repository.BlogRepository;
import com.service.quickblog.repository.CommentsRepository;

@Service
public class CommentsService {

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Comment mapDTOtoClass(CommentDTO DTO) {
        return modelMapper.map(DTO, Comment.class);
    }

    public CommentDTO mapClasstoDTO(Comment comment) {
        return modelMapper.map(comment, CommentDTO.class);
    }

    public Blog getBlogById(String blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not present with id " + blogId));
        return blog;
    }

    public List<Comment> getComments(String blogId) {
        List<Comment> comments = commentsRepository.findByBlogId(blogId);
        return comments;
    }

    @Transactional
    public CommentDTO create(CommentDTO commentDTO) {
        Comment comment = mapDTOtoClass(commentDTO);
        Comment savedComment = commentsRepository.save(comment);
        String blogId = comment.getBlogId();
        Blog blog = getBlogById(blogId);
        List<String> commentIds = blog.getCommentIds();

        if (commentIds == null) {
            commentIds = new ArrayList<>();
        }

        commentIds.add(savedComment.getId()); 
        blog.setCommentIds(commentIds);
        blogRepository.save(blog);

        return mapClasstoDTO(savedComment);
    }

    
    private CommentResponseDTO mapCommentToDTO(Comment comment, String blogTitle) {
    CommentResponseDTO dto = new CommentResponseDTO();
    dto.setId(comment.getId());
    dto.setName(comment.getName());
    dto.setContent(comment.getContent());
    dto.setApproved(comment.isApproved());
    dto.setCreatedAt(comment.getCreatedAt());
    dto.setUpdatedAt(comment.getUpdatedAt());
    dto.setBlogTitle(blogTitle);
    return dto;
    }

    @Transactional
    public List<CommentResponseDTO> getCommentsByUserId(String userId) {
        List<Blog> blogs = blogRepository.findByUserId(userId);
        Map<String, String> blogIdToTitle = blogs.stream()
            .collect(Collectors.toMap(Blog::getId, Blog::getTitle));
        List<String> blogIds = new ArrayList<>(blogIdToTitle.keySet());
        List<Comment> comments = commentsRepository.findByBlogIdIn(blogIds);

        return comments.stream()
            .map(comment -> mapCommentToDTO(comment, blogIdToTitle.get(comment.getBlogId())))
            .collect(Collectors.toList());
    }

    public String setApprove(String id) {
        Comment comment=commentsRepository.findById(id).orElseThrow(()->new RuntimeException("comment not found with id: "+id));
        comment.setApproved(true);
        commentsRepository.save(comment);
        return "Comment approved Successfully!";
    }

    @Transactional
    public String deleteComment(String id) {
        Comment comment=commentsRepository.findById(id).orElseThrow(()->new RuntimeException("comment not found with id: "+id));
        Blog blog =blogRepository.findById(comment.getBlogId()).orElseThrow(()->new RuntimeException("blog not found"));
        List<String> updatedCommentIds = blog.getCommentIds().stream().filter(commentId->!commentId.matches(id)).toList();
        blog.setCommentIds(updatedCommentIds);
        blogRepository.save(blog);
        commentsRepository.delete(comment);
        return "Comment deleted Successfully!";
    }

    }

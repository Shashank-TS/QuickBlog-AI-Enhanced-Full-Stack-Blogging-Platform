package com.service.quickblog.service;

import java.util.List;
import java.util.stream.Collectors;
import com.service.quickblog.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.service.quickblog.dto.BlogDTO;
import com.service.quickblog.model.Blog;
import com.service.quickblog.model.Comment;
import com.service.quickblog.model.User;
import com.service.quickblog.repository.BlogRepository;
import com.service.quickblog.repository.CommentsRepository;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

     @Autowired
    private ModelMapper modelMapper;

    BlogService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Blog mapDTOtoBlog(BlogDTO blogDTO){
        return modelMapper.map(blogDTO,Blog.class);
    }
    public BlogDTO mapBlogtoDTO(Blog blog){
        return modelMapper.map(blog,BlogDTO.class);
    }

    public BlogDTO createBlog(BlogDTO blogDTO) {
        Blog blog=mapDTOtoBlog(blogDTO);
        User user =userRepository.findById(blog.getUserId()).orElseThrow();
        blog.setUserName(user.getFullname());
        Blog savedBlog = blogRepository.save(blog);
        if (savedBlog.isPublished()) { 
            emailService.sendNewBlogNotification(savedBlog);
        }
        return mapBlogtoDTO(savedBlog);
        
    }
    public List<Blog> getBlogs() {      
        List<Blog> allBlogs = blogRepository.findAll();
        List<Blog> publishedBlogs = allBlogs.stream()
                                            .filter(Blog::isPublished) 
                                            .collect(Collectors.toList());
        return publishedBlogs;
    }
    public BlogDTO getBlogById(String id) {
        Blog blog=blogRepository.findById(id).orElseThrow(()->new RuntimeException("Blog not present with id "+id));
        return mapBlogtoDTO(blog);
        
    }
    public List<Blog> getBlogByUserId(String userId) {
        List<Blog> blogs = blogRepository.findByUserId(userId);
        return blogs;      
    }

    public String setPublish(String id,boolean publishStatus) {
        Blog blog =blogRepository.findById(id).orElseThrow(()->new RuntimeException("comment not found with id: "+id));
        blog.setPublished(publishStatus);
        Blog savedBlog = blogRepository.save(blog);
        if (savedBlog.isPublished()) { 
            emailService.sendNewBlogNotification(savedBlog);
        }
        if(blog.isPublished()==true){
            return "Blog published Successfully!";
        }
        return "Blog Unpublished!";
    }

    public String deleteBlog(String id) {
        Blog blog =blogRepository.findById(id).orElseThrow(()->new RuntimeException("blog not found with id: "+id));
        blogRepository.delete(blog);
        List<Comment> comments = commentsRepository.findByBlogId(id);
        commentsRepository.deleteAll(comments);
        return "Blogs and comments deleted Successfully!";
    }

    public BlogDTO updateBlog(String id, BlogDTO blog) {
        Blog oldBlog=blogRepository.findById(id).orElseThrow(()->new RuntimeException("Blog not present with id "+id));
        oldBlog.setTitle(blog.getTitle());
        oldBlog.setSubTitle(blog.getSubTitle());
        oldBlog.setCategory(blog.getCategory());
        oldBlog.setDescription(blog.getDescription());
        oldBlog.setPublished(blog.getisPublished());
        oldBlog.setImage(blog.getImage());
        Blog savedBlog = blogRepository.save(oldBlog);
        return mapBlogtoDTO(savedBlog);
    }
}

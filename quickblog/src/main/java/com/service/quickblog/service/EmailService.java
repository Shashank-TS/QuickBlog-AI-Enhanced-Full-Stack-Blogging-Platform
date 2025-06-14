package com.service.quickblog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.service.quickblog.model.Blog;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender; 

    @Autowired
    private SubscriberService subscriberService; 

    @Value("${email.blog.link}")
    private String blogEmailUrl;

    @Value("${email}")
    private String emailAddress;

    // send a notification for a new blog post
    @Async
    public void sendNewBlogNotification(Blog blog) {
        
        List<String> subscriberEmails = subscriberService.getAllSubscriberEmails();

        if (subscriberEmails.isEmpty()) {
            System.out.println("EmailService: No subscribers to notify for new blog: " + blog.getTitle());
            return;
        }

        String blogLink = String.format(blogEmailUrl, blog.getId()); 

        // Create the email subject and body
        String subject = "New Blog Post Published: " + blog.getTitle();
        String body = String.format(
            "Hello Blog Subscriber,\n\nA new blog post titled '%s' has just been published!\n\n" +
            "Read it here: %s\n\n" +
            "Happy reading!\n\n" +
            "The QuickBlog Team",
            blog.getTitle(), blogLink 
        );

        for (String email : subscriberEmails) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailAddress); 
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body);

            try {
                mailSender.send(message);
                System.out.println("EmailService: Sent new blog notification to: " + email);
            } catch (MailException e) {
                System.err.println("EmailService: Error sending email to " + email + ": " + e.getMessage());
            }
        }
    }
}

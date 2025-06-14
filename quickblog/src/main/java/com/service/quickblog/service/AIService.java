package com.service.quickblog.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.quickblog.dto.SummarizeBlogRequest;
import com.service.quickblog.dto.generateBlogRequest;

@Service
public class AIService {

    @Value("${gemini.api.uri}")
    private String uri;

    @Value("${gemini.api.key}")
    private String key;

    @Autowired
    private RestTemplate restTemplate;

    public String SummarizeBlog(SummarizeBlogRequest request) {
        String prompt = "Please summarize the following blog post concisely. please don't give any subject line.\n Blog content:\n"
                + request.getContent();
        String aiResponse =getAnswer(prompt);
        return processRAIResponse(aiResponse);
    }

    public String generateBlog(generateBlogRequest request) {
        String prompt = "please Generate a blog for the title: "+request.getTitle()+"as a plain text";
        String aiResponse =getAnswer(prompt);
        return processRAIResponse(aiResponse);
        
    }

    public String getAnswer(String prompt){
        Map<String,Object> requestBody=Map.of(
            "contents",new Object[]{
                Map.of("parts",new Object[]{
                    Map.of("text",prompt)
                })             
            }
        );

        ResponseEntity<String> responseEntity=restTemplate.postForEntity(uri+key, requestBody, String.class);
        return responseEntity.getBody();
    }

    private String processRAIResponse(String aiResponse) {
        try {
            ObjectMapper mapper=new ObjectMapper();
            JsonNode rootNode =mapper.readTree(aiResponse);
            String summary = rootNode.at("/candidates/0/content/parts/0/text").asText()
                        .replaceAll("\\*", "") 
                        .replaceAll("#", "")  
                        .replaceAll("_", ""); 
            return summary;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "unable to process the response";
        }
    }



    

}

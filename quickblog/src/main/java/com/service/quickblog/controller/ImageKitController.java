package com.service.quickblog.controller;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/imagekit")
public class ImageKitController {

    private static final String PRIVATE_KEY = "private_TOu/W9TB72fweXg0zT4K9COtr80=";

    @GetMapping("/auth")
    public Map<String, String> getImageKitAuth() {
        String token = UUID.randomUUID().toString();
        long expire = Instant.now().getEpochSecond() + 600;

        String toSign = token + expire;
        String signature = new HmacUtils(HmacAlgorithms.HMAC_SHA_1, PRIVATE_KEY).hmacHex(toSign);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("expire", String.valueOf(expire));
        response.put("signature", signature);

        return response;
    }
}

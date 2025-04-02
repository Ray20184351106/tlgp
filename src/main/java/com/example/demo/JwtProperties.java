package com.example.demo;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;

    public String getSecret() { 
        return secret; 
    }
    
    public void setSecret(String secret) { 
        this.secret = secret; 
    }

    public long getAccessTokenExpiration() { 
        return accessTokenExpiration; 
    }
    
    public void setAccessTokenExpiration(long accessTokenExpiration) { 
        this.accessTokenExpiration = accessTokenExpiration; 
    }

    public long getRefreshTokenExpiration() { 
        return refreshTokenExpiration; 
    }
    
    public void setRefreshTokenExpiration(long refreshTokenExpiration) { 
        this.refreshTokenExpiration = refreshTokenExpiration; 
    }
}

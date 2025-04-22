package com.spring.erp_ordit.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.fetch.mytest")
@EnableConfigurationProperties(AppConfig.class)
public class AppConfig {

    private String protocol;
    private String url;

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}

/*
 * package com.spring.erp_ordit.config;
 * 
 * import com.fasterxml.jackson.annotation.JsonProperty; import
 * com.fasterxml.jackson.databind.ObjectMapper;
 * 
 * import org.springframework.stereotype.Component; import java.io.File; import
 * java.io.IOException;
 * 
 * @Component public class AppConfig {
 * 
 * private Fetch fetch;
 * 
 * public Fetch getFetch() { return fetch; }
 * 
 * public void setFetch(Fetch fetch) { this.fetch = fetch; }
 * 
 * public static class Fetch { private Mytest mytest;
 * 
 * public Mytest getMytest() { return mytest; }
 * 
 * public void setMytest(Mytest mytest) { this.mytest = mytest; }
 * 
 * public static class Mytest { private String protocol; private String url;
 * 
 * public String getProtocol() { return protocol; }
 * 
 * public void setProtocol(String protocol) { this.protocol = protocol; }
 * 
 * public String getUrl() { return url; }
 * 
 * public void setUrl(String url) { this.url = url; } } }
 * 
 * // JSON 파일을 읽어와서 AppConfig 객체로 반환하는 메서드 public static AppConfig loadConfig()
 * throws IOException { ObjectMapper objectMapper = new ObjectMapper(); return
 * objectMapper.readValue(new File("src/main/resources/AppConfig.json"),
 * AppConfig.class); } }
 */
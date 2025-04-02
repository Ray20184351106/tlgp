package com.example.demo.entity;



import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;


@Entity
@Table(name = "users")
public class User {
    // 方案1：使用UUID（推荐）
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(columnDefinition = "CHAR(36)")
    private String user_id;

    @Column(unique = true)
    private String username;

    private String password;

    // 构造方法
    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter/Setter

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
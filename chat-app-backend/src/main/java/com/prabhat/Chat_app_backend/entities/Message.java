package com.prabhat.Chat_app_backend.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages") // MongoDB collection
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    @Id
    private String id; // MongoDB uses String id

    private String roomId;
    private String sender;
    private String content;
    private LocalDateTime timeStamp;

    // Constructor for easy creation
    public Message(String roomId, String sender, String content) {
        this.roomId = roomId;
        this.sender = sender;
        this.content = content;
        this.timeStamp = LocalDateTime.now();
    }
}

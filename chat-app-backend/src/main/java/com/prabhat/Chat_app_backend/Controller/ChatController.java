package com.prabhat.Chat_app_backend.Controller;

import com.prabhat.Chat_app_backend.entities.Message;
import com.prabhat.Chat_app_backend.entities.Room;
import com.prabhat.Chat_app_backend.payload.MessageRequest;
import com.prabhat.Chat_app_backend.repositories.MessageRepository;
import com.prabhat.Chat_app_backend.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    private final RoomRepository roomRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(RoomRepository roomRepository,
                          MessageRepository messageRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage") // Frontend publishes here
    public void sendMessage(MessageRequest request) {
        // 1️⃣ Find the room
        Room room = roomRepository.findByRoomId(request.getRoomId());
        if (room == null) {
            throw new RuntimeException("Room not found!");
        }

        // 2️⃣ Create message
        Message message = new Message();
        message.setRoomId(request.getRoomId()); // important for querying later
        message.setSender(request.getSender());
        message.setContent(request.getContent());
        message.setTimeStamp(LocalDateTime.now());

        // 3️⃣ Save message in MessageRepository for previous message fetch
        messageRepository.save(message);

        // Optional: also save inside Room for easy access
        room.getMessages().add(message);
        roomRepository.save(room);

        // 4️⃣ Broadcast to all clients subscribed to this room
        messagingTemplate.convertAndSend(
                "/topic/rooms/" + request.getRoomId(),
                message
        );
    }
}

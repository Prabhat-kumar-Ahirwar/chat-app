package com.prabhat.Chat_app_backend.Controller;

import com.prabhat.Chat_app_backend.entities.Room;
import com.prabhat.Chat_app_backend.entities.Message;
import com.prabhat.Chat_app_backend.repositories.MessageRepository;
import com.prabhat.Chat_app_backend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;

    @Autowired
    private MessageRepository messageRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // 1️⃣ Create a new room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        if (roomRepository.findByRoomId(room.getRoomId()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Room already exists");
        }
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // 2️⃣ Get a room by roomId
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room does not exist");
        }
        return ResponseEntity.ok(room);
    }

    // 3️⃣ Get all messages of a room (MongoDB)
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Fetch messages directly from MongoDB, ordered by timestamp ascending
        List<Message> messages = messageRepository.findByRoomIdOrderByTimeStampAsc(roomId);

        return ResponseEntity.ok(messages);
    }
}

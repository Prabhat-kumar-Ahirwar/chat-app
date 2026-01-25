package com.prabhat.Chat_app_backend.repositories;

import com.prabhat.Chat_app_backend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room,String> {
    //get room by using room id
    Room findByRoomId(String roomId);

}

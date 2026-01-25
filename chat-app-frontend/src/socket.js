import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (onMessage) => {
  const socket = new SockJS("http://localhost:8080/chat");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    stompClient.subscribe("/topic/room", (message) => {
      onMessage(JSON.parse(message.body));
    });
  });
};

export const sendMessageSocket = (message) => {
  stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
};

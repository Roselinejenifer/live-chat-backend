
import { Server } from 'socket.io';

let io = null;

class SocketIO {
  constructor() {
    this.io = null;
  }

  connect(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("chat_message", (data) => {
        console.log("Message received:", data);
        this.io.emit("chat_message", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  static init(server) {
    if (!io) {
      io = new SocketIO();
      io.connect(server);
    }
  }

  static getSocketConnection() {
    return io ? io.io : null;
  }
}

export default SocketIO;

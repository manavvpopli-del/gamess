const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Otaqların saxlandığı yaddaş
const rooms = {};

io.on('connection', (socket) => {
  console.log('Yeni bağlantı:', socket.id);

  // Otaq yaratmaq
  socket.on('createRoom', (roomCode) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        players: {},
        currentQuestion: 0,
        answers: {}, // { playerId: [answers] }
        started: false
      };
    }
    
    if (Object.keys(rooms[roomCode].players).length >= 2) {
      socket.emit('error', 'Otaq doludur!');
      return;
    }

    rooms[roomCode].players[socket.id] = {
      id: socket.id,
      answers: [],
      ready: false
    };
    
    socket.join(roomCode);
    socket.roomCode = roomCode;
    
    socket.emit('roomCreated', roomCode);
    
    // Əgər 2 nəfər varsa, oyunu başlat
    if (Object.keys(rooms[roomCode].players).length === 2) {
      rooms[roomCode].started = true;
      io.to(roomCode).emit('gameStart', {
        totalQuestions: 30,
        currentQuestion: 0
      });
    } else {
      socket.to(roomCode).emit('playerJoined', 'Rəqib qoşuldu');
    }
  });

  // Otağa qoşulmaq
  socket.on('joinRoom', (roomCode) => {
    if (!rooms[roomCode]) {
      socket.emit('error', 'Otaq tapılmadı!');
      return;
    }
    
    if (Object.keys(rooms[roomCode].players).length >= 2) {
      socket.emit('error', 'Otaq doludur!');
      return;
    }

    rooms[roomCode].players[socket.id] = {
      id: socket.id,
      answers: [],
      ready: false
    };
    
    socket.join(roomCode);
    socket.roomCode = roomCode;
    
    socket.emit('joinedRoom', roomCode);
    
    // Əgər 2 nəfər varsa, oyunu başlat
    if (Object.keys(rooms[roomCode].players).length === 2) {
      rooms[roomCode].started = true;
      io.to(roomCode).emit('gameStart', {
        totalQuestions: 30,
        currentQuestion: 0
      });
    }
  });

  // Cavab göndərmək
  socket.on('submitAnswer', (data) => {
    const roomCode = socket.roomCode;
    if (!rooms[roomCode]) return;
    
    const room = rooms[roomCode];
    const player = room.players[socket.id];
    
    if (player) {
      player.answers[data.questionIndex] = data.answer;
      player.ready = true;
      
      // Bütün oyunçuların cavab verib-vermədiyini yoxla
      const players = Object.values(room.players);
      const allAnswered = players.every(p => p.ready && p.answers[data.questionIndex] !== undefined);
      
      if (allAnswered) {
        // Növbəti suala keç
        room.currentQuestion++;
        
        // Hər kəsi "hazır deyil" et
        players.forEach(p => p.ready = false);
        
        if (room.currentQuestion >= 30) {
          // Oyun bitdi
          io.to(roomCode).emit('gameEnd', {
            players: room.players
          });
        } else {
          io.to(roomCode).emit('nextQuestion', {
            questionIndex: room.currentQuestion
          });
        }
      } else {
        // Gözləmə vəziyyətini göndər
        socket.to(roomCode).emit('waitingForAnswer', {
          playerId: socket.id
        });
      }
    }
  });

  // Bağlantı kəsildi
  socket.on('disconnect', () => {
    const roomCode = socket.roomCode;
    if (roomCode && rooms[roomCode]) {
      delete rooms[roomCode].players[socket.id];
      socket.to(roomCode).emit('playerLeft', 'Rəqib ayrıldı');
      
      if (Object.keys(rooms[roomCode].players).length === 0) {
        delete rooms[roomCode];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});

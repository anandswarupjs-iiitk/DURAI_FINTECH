let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their private room for targeted events
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

// Emit to a specific user's room
const emitToUser = (userId, event, data) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(event, { ...data, timestamp: new Date() });
};

// Emit to all connected clients (admin broadcasts)
const emitToAll = (event, data) => {
  if (!ioInstance) return;
  ioInstance.emit(event, { ...data, timestamp: new Date() });
};

// Predefined event emitters
const emitNewTransaction = (userId, transaction) =>
  emitToUser(userId, 'newTransaction', { transaction });

const emitFraudDetected = (userId, alert) =>
  emitToUser(userId, 'fraudDetected', { alert });

const emitRiskScoreChanged = (userId, score, level) =>
  emitToUser(userId, 'riskScoreChanged', { score, level });

const emitAlertCreated = (userId, alert) =>
  emitToUser(userId, 'alertCreated', { alert });

const emitUserLoggedIn = (userId, metadata) =>
  emitToUser(userId, 'userLoggedIn', metadata);

const emitPasswordChanged = (userId) =>
  emitToUser(userId, 'passwordChanged', { message: 'Your password was changed.' });

module.exports = {
  initSocket,
  emitToUser,
  emitToAll,
  emitNewTransaction,
  emitFraudDetected,
  emitRiskScoreChanged,
  emitAlertCreated,
  emitUserLoggedIn,
  emitPasswordChanged,
};
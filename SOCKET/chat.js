var websocket = require("./socketServer");

var connections = Object.create(null);
let clientSocketIds = [];
let connectedUsers = [];

const userSocketIdMap = new Map();
let user = null;
const sockets = {};

websocket.listen(55555, "localhost", function (conn) {
  conn.id = Math.random().toString().substr(2);
  connections[conn.id] = conn;

  conn.on("data", (opcode, data) => {
    let payload = JSON.parse(data);
    user = payload.username;

    if (payload.type === "onconnect") {
      addClientToMap(user, conn.id);

      clientSocketIds.push({ conn: conn, user: user });

      connectedUsers = connectedUsers.filter((item) => item.user != user);
      connectedUsers.push({ ...user, conn: conn });

      let newpayload = {
        type: "updateUserList",
        userlist: sockets,
      };
      for (var c in connections) {
        connections[c].send(JSON.stringify(newpayload));
        // console.log(c);
        // console.log(connections[c]);
      }
    }
  });

  conn.on("onmessage", function (data) {
    connections.forEach((c) => {
      c.send(data);
    });
  });

  conn.on("close", function () {
    // remove connection
    console.log(conn.id);
    delete connections[conn.id];
    connectedUsers = connectedUsers.filter((item) => item.connID != conn.id);

    removeClientFromMap(user, conn.id);
    let newpayload = {
      type: "updateUserList",
      userlist: sockets,
    };
    for (var c in connections) {
      connections[c].send(JSON.stringify(newpayload));
      // console.log(c);
      // console.log(connections[c]);
    }
  });
});

function addClientToMap(userName, socketId) {
  if (!userSocketIdMap.has(userName)) {
    sockets[userName] = socketId;
    //when user is joining first time
    userSocketIdMap.set(userName, new Set([socketId]));
  } //else {
  //     //user had already joined from one client and now joining using another
  //     client;
  //     userSocketIdMap.get(userName).add(socketId);
  //   }
}
function removeClientFromMap(userName, socketId) {
  if (userSocketIdMap.has(userName)) {
    let userSocketIdSet = userSocketIdMap.get(userName);
    userSocketIdSet.delete(socketId);
    //if there are no clients for a user, remove that user from online
  }
}

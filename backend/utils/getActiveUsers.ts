import {activeConnections} from "./activeConnections";

function getActiveUsers() {
  const usersList = Object.values(activeConnections).map(conn => conn.username);
  const message = JSON.stringify({
    type: 'ACTIVE_USERS',
    payload: usersList,
  });
  Object.values(activeConnections).forEach(({ ws }) => ws.send(message));
}

export default getActiveUsers;


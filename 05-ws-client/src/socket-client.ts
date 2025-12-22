import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authorization: token
    }
  });

  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector('#server-status');
  const ulClients = document.querySelector('#clients-ul');

  const messageForm = document.querySelector<HTMLFormElement>("#message-form");
  const messageInput = document.querySelector<HTMLInputElement>("#message-input");

  const ulMessages = document.querySelector<HTMLUListElement>("#messages-ul");

  socket.on('connect', () => {
    serverStatusLabel!.innerHTML = 'Online';
  });

  socket.on('disconnect', () => {
    serverStatusLabel!.innerHTML = 'Offline';
  });

  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = ``;

    clients.forEach(clientId => {
      clientsHtml = `<li>${clientId}</li>`;
    });

    ulClients!.innerHTML = clientsHtml;
  });

  messageForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageInput!.value.trim().length === 0) return;

    socket.emit('client-message', { message: messageInput!.value });

    messageInput!.value = '';
  });

  socket.on('server-message', (payload: { fullName: string, message: string }) => {
    ulMessages!.innerHTML += `<li>${payload.message}</li>`;
  })
}
const { createApp, ref } = Vue;

createApp({
  setup() {
    const message_chat = ref('');
    const server_status = ref('');
    const username = localStorage.getItem('name');
    const uuid = localStorage.getItem('uuid');
    const dialog = ref(false);
    const question = ref({});
    const clients = ref([]);
    const sendMessage = () => {
      socket.emit('send-message', message_chat.value);
      message_chat.value = '';
    };

    const renderMessage = (payload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, message, name } = payload;
      const divElement = document.createElement('div');
      divElement.classList.add('message');
      if (userId !== socket.id) {
        divElement.classList.add('incoming');
      }
      divElement.innerHTML = message;
      const chatElement = document.querySelector('#chat');
      chatElement.appendChild(divElement);
      chatElement.scrollTop = chatElement.scrollHeight;
    };

    if (!username) {
      window.location.replace('/');
      throw new Error('username is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socket = io({
      auth: {
        token: 'abc-123',
        name: username,
        type: 'player',
        uuid: uuid,
      },
    });

    socket.on('connect', () => {
      console.log('CONECTADO');
      server_status.value = 'CONECTADO';
    });

    socket.on('disconnect', () => {
      console.log('DESCONECTADO');
      server_status.value = 'DESCONECTADO';
    });

    socket.on('welcome-service', (data) => {
      console.log(data);
    });

    socket.on('on-clients-changed', (data) => {
      clients.value = data;
    });

    socket.on('on-message', (data) => {
      console.log(data);
      renderMessage(data);
    });

    socket.on('on-open-question', (data) => {
      console.log('open question', data);
      question.value = data;
      dialog.value = true;
    });

    return {
      message_chat,
      server_status,
      clients,
      dialog,
      question,
      sendMessage,
    };
  },
}).mount('#app');

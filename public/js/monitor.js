const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const message_chat = ref('');
    const server_status = ref('');
    // const username = localStorage.getItem('name');
    const clients = ref([]);
    // const questions = ref([]);
    const sendMessage = () => {
      socket.emit('send-message', message_chat.value);
      message_chat.value = '';
    };

    const sendCommand = (message) => {
      socket.emit('send-command', message);
      console.log('enviando ', message);
    };

    const sendQuestion = (question) => {
      socket.emit('send-question', question);
      console.log('enviando question', question);
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

    // if (!username) {
    //   window.location.replace('/');
    //   throw new Error('username is required');
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socket = io({
      auth: {
        token: 'abc-123',
        name: 'monitor',
        type: 'monitor',
        uuid: 0,
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
      console.log('data', data);
      clients.value = data;
    });

    // socket.on('on-question-list', (data) => {
    //   console.log('questions', data);
    //   questions.value = data;
    // });

    socket.on('on-message', (data) => {
      console.log(data);
      renderMessage(data);
    });

    onMounted(() => {
      console.log('cargando monitor');
    });

    return {
      message_chat,
      server_status,
      clients,
      sendMessage,
      sendCommand,
      sendQuestion,
    };
  },
}).mount('#app');

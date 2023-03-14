const { createApp } = require('vue');
import router from './router/index';
import App from './App.vue';

let app = createApp(App);

app.use(router);
app.mount('#app');

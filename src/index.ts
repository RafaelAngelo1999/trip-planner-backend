import App from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const app = new App();
app.listen(PORT);

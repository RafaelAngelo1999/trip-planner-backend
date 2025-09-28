import App from './app';

const PORT = parseInt(process.env.PORT || '3001');

// Initialize the application
const app = new App();

// Start the server
app.listen(PORT);

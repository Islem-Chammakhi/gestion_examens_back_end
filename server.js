require('dotenv').config(); // Charger les variables d'environnement
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors');

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const roomRoutes = require('./routes/roomRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const validationRoutes = require('./routes/validationRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

//middleware
const verifyJWT = require('./middleware/verifyJWT');

// Créer une instance de l'application Express
const app = express()

const port = process.env.PORT || 3500

// Middleware pour autoriser les requêtes cross-origin
app.use(cors({
  origin: 'http://localhost:3000', // Remplace ça par l'URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Les méthodes autorisées
  credentials: true // Si tu veux envoyer des cookies ou des sessions
}))

// Middleware pour parser les données JSON
app.use(express.json())

// Middleware pour parser les cookies
app.use(cookieParser())

// Utiliser les routes
app.use('/api/auth', authRoutes);

app.use(verifyJWT) // Toutes les routes en dessous de cette ligne nécessitent une authentification

app.use('/api/exams', examRoutes);
app.use('/api/rooms', roomRoutes); 
app.use('/api/supervisors', supervisorRoutes)
app.use('/api/validateExams', validationRoutes)
app.use('/api/subjects', subjectRoutes)


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});


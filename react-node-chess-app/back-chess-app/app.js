var createError = require('http-errors'); //bibliothèque pour créer des erreurs HTTP personnalisées.
var express = require('express'); //framework utilisé pour développer des applications web.
var path = require('path'); //bibliothèque Node.js utilisée pour manipuler les chemins de fichiers.
var cookieParser = require('cookie-parser'); //utilisé pour parser les cookies envoyés avec les requêtes.
var logger = require('morgan'); // bibliothèque morgan est utilisé pour journaliser les requêtes entrantes.
var bodyParser = require('body-parser'); //middlaware utilisé pour extraire les données du corps de la requête et les stocker dans req.body.
var acl = require('express-acl'); //middleware qui permet de définir des autorisations pour des utilisateurs et des groupes d'utilisateurs.
const jwt = require('jsonwebtoken'); //middleware qui gere les tokens
const unless = require('express-unless'); //middleware qui est utilisé pour définir les routes à ne pas utiliser
const cors = require('cors'); //middleware pour autoriser les requêtes de react

acl.config({
  filename: 'policies.json',
  path: 'config',
  baseUrl: '/',
  defaultRole: 'user',
  roleSearchPath: 'role'
});

// Middleware pour vérifier les token
const verifToken = (req, res, next) => {
  // Vérification du token
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Authentication failed' });
    req.decoded = decoded;
    next();
  });
};
verifToken.unless = unless;

//Importation des routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var exercisesRouter = require('./routes/exercises');
var levelsRouter = require('./routes/levels');
var eloExercise = require('./routes/eloExercise');
var unlockLevel = require('./routes/unlockLevel');

var app = express(); //initialise une nouvelle application Express.

app.use(logger('dev')); //utilise Morgan pour journaliser les requêtes entrantes en mode développement.
app.use(express.json()); //utilise le middleware json pour parser le corps des requêtes entrantes en tant que JSON.
app.use(express.urlencoded({ extended: false })); //utilise le middleware urlencoded pour parser le corps des requêtes entrantes avec une syntaxe x-www-form-urlencoded.
app.use(cookieParser()); //utilise cookie-parser pour parser les cookies envoyés avec les requêtes.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //utilise bodyParser pour extraire les données du corps de la requête.
app.use(express.static(path.join(__dirname, 'public'))); //utilise le middleware static pour servir des fichiers statiques du dossier public.
app.use(cors()); //utilise le middleware cors pour pouvoir faire des échange avec react.

// Effectue les vérifications nécessaire
app.use(verifToken.unless({ path: ['/', '/users/signin', '/users/signup'] })); //vérification du token a chaque appel sauf signin et signup
app.use(acl.authorize); //configurer les autorisations pour les utilisateurs connectés

// Les routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/levels', levelsRouter);
app.use('/eloExercise', eloExercise);
app.use('/unlockLevel', unlockLevel);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// définit un gestionnaire d'erreur générique qui gère les erreurs produites par les routes et les middlewares précédents.
// Il définit un message d'erreur et une erreur en mode développement
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(500).json({ error: err.message });
});

module.exports = app;

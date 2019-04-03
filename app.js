const path = require('path'),
    express = require('express'),
    cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv();
const mongoose = require('mongoose');


const routesCt = require('./backend/routes/ct.route'); // Imports routes for the products
const app = express();

// Set up mongoose connection

const mongoDB = appEnv.isLocal ?
'mongodb://V8ck_42kl_JdkCFX:T1sRSW3mciI_joYf@10.11.241.24:54742/yoHdxVY1vwAAUJ8T' :
appEnv.getService('cfinstance').credentials.uri;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use('/register', routesCt);

app.use('/', express.static(path.join(__dirname, 'uifolder')));

//INSERT CODE IN STEP 3

const iPort = appEnv.isLocal ? 3000: appEnv.port;
app.listen(iPort, function () {
    console.log(`Congrats, your producer app is listening on port ${iPort}!`);
});

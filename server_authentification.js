const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('./UserRepository')
const { Client } = require('pg');
const cookieParser = require('cookie-parser');



let user = {}
let authenticatedUsers = [];

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({

    credentials: true,

    origin: 'http://localhost:3000'

}));
app.use(firewall)


app.use(
    session({
        secret: 'my-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'usersDB',
    password: 'azerty',
    port: 5432
});

client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
    } else {

        console.log('connected');
    }
});



const allowedEndpoints = [

    '/authentificate',
    '/register',

];


function firewall(req, res, Next) {


    const allowedEndpoint = req.originalUrl;
    if (!allowedEndpoints.includes(allowedEndpoint)) {

        if (req.cookies.authToken === user.token) {
            Next()
        } else {

            res.end('Access non autorisé');
        }
    } else {
        Next()


    }
}


app.get('/hello', (req, res) => {


    return res.status(200).send('<h1>hello</h1>');
});

app.get('/restricted1', (req, res) => {
    //const token = req.headers.token;
    const authToken = req.cookies.authToken;
    console.log(authToken)
    if (token === authToken) {
        res.status(200).json({ message: 'connecté avec authToken' });
    }

    else {
        res.status(403).send('Token invalid');
    }


});

app.get('/restricted2', (req, res) => {

    res.status(200).send('<h1>Admin space</h1');



});





app.post('/authentificate', async (req, res) => {
    /*  
     
  */
    let { email, password } = req.body;
    client.query('SELECT email, user_password as password FROM users WHERE email = $1', [email], (err, result) => {
        if (result.rows.length === 0) {
            res.status(401).json({ message: 'Invalid email or password 3' });
        }
        if (result.rows.length !== 0) {
            console.log(result.rows[0])
            user = result.rows[0]
            checkCredentials(user, password)


        }

    })

    async function checkCredentials(userToCheck, password) {
        if (!user) {
            return res.status(401).json({ message: 'checkCredentials Invalid email or password1' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(password)
        console.log(user.password)


        if (!isPasswordValid) {
            return res.status(401).json({ message: 'checkCredentials Invalid email or password2' });
        }

        if (isPasswordValid) {
            user.token = uuidv4();
            authenticatedUsers.push({ token: user.token, email: user.email })

            res.cookie("authToken", user.token)

            return res.status(200).json({ message: 'checkCredentials connected' });
        }
    }



});



app.post('/register', (req, res) => {
    const { email, password } = req.body;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    const passwordHash = bcrypt.hashSync(password, salt);
    newUser = { email: email, passwordHash: passwordHash }
    function callback(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error add data to database');
        } else {
            res.send('Data added to database successfully');
        }
    };
    userRepository.newUserRegisteredBD(newUser, client, callback)

})


app.listen(1000, () => {
    console.log('Server started on port 1000');
});
const express = require('express');
const session = require('express-session');
const {OAuth2Client} = require('google-auth-library');
const app = express();
//let expraaess = require( 'express' );
//let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );




io.of( '/stream' ).on( 'connection', stream );


app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/home.html' );
} );
app.get( '/index', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
} );
app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));  

const client = new OAuth2Client(
  '383281791298-nvhiv0girntrfnu5pfi0lfaf21p8gbog.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/'
);

app.get('/login', (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    access_type: 'offline',
    prompt: 'consent'
  });
  res.redirect(authorizeUrl);
});

app.get('/index', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await client.getToken(code);
  req.session.tokens = tokens;

  const user = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: '383281791298-nvhiv0girntrfnu5pfi0lfaf21p8gbog.apps.googleusercontent.com'
  });
  console.log(user);

  res.redirect('/index');
});

app.get('/index', async (req, res) => {
  const { tokens } = req.session;
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });
  console.log(data);

  res.send(`Hello ${data.name}!`);
});


  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
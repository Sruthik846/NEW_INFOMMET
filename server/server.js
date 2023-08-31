// const express = require('express');
// const cookieParser = require('cookie-parser');

// const app = express();
// app.use(cookieParser());
// console.log("server file");
//   app.get('/', (req, res) => {
//     res.cookie('sample', 'cookieValue', {
//       httpOnly: true,
//       secure: true, // Use 'secure' to only send the cookie over HTTPS
//       sameSite: 'strict', // Set SameSite policy for additional security
//       // other cookie options like maxAge, domain, path, etc.
//     });

//     res.send('HttpOnly cookie set.');
//   });


// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });



const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const cookie = require('js-cookie');

// Configure CORS to allow requests from specific origins
const allowedOrigins = ['http://localhost:3000', 'http://192.168.0.44:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // If you're sending cookies
}));

app.use(express.json());
app.use(cookieParser());

// app.post('/api/submit', (req, res) => {
//     const { name, email } = req.body;
//     // Process the received data, perform actions, and send a response
//     console.log('Received data:',{ name, email } );
//     res.status(200).json({ message: `Data received successfully ${name} ${email}` });
//   });


app.post('/api/loginn', (req, res) => {
  const { tokens } = req.body;
  // In a real application, validate the user's credentials
  // const jsonString = JSON.stringify(tokens);
  // console.log(jsonString);
    res.cookie('sessionn', tokens, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.status(200).json({ success: true, });
 
});

// For getting coie
app.get('/get-cookie-data', (req, res) => {
  const cookieValue = req.cookies.sessionn; // Access the HTTP-only cookie
  res.json({ auth: cookieValue });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


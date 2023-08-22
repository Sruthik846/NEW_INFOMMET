const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('https://meetingapi.infolksgroup.com/api/login', (req, res) => {
  res.cookie('myCookie', 'cookieValue', {
    httpOnly: true,
    secure: true, // Use 'secure' to only send the cookie over HTTPS
    sameSite: 'strict', // Set SameSite policy for additional security
    // other cookie options like maxAge, domain, path, etc.
  });
  res.send('HttpOnly cookie set.');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
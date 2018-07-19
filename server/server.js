const bodyParser = require("body-parser");
const cors = require("cors");
const TCPClient = require("../lib/TCPClient");
const MOMessage = require("../lib/MOMessage");
const options = require("./config").options;

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');
const userData = require("../lib/utils/userData");
const { propsValidator, validationResultFormatted } = require("../lib/utils/propsValidator");

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Ksidedev',
    text: 'Sent from backend',
    createdAt: moment().format("YYYY-MM-DD")
  });

  socket.on('createMessage', (message) => {
    var date = new Date();
    console.log('createMessage', message);

    //To send to every browser or open socket
    socket.broadcast.emit('updatedMessage', {
      from: message.from,
      text: message.text,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss")
    });

    //To send back to sending broswer/socket
    socket.emit('updatedMessage', {
      from: message.from,
      text: message.text,
      createdAt: moment().format("HH:mm:a")
    });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});









/************/
/* Requests */
/************/

// Use body parser and send an error if there are any errors, like SyntaxError
const addRawBody = (req, res, buf) => {
    req.rawBody = buf.toString();
};

app.use((req, res, next) => {
    bodyParser.json({
        verify: addRawBody,
    })(req, res, error => {
        if (error && error instanceof SyntaxError) {
            console.log(error);
            return res.status(400).send("There are some syntax errors in the data received");
        }
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        next();
    });
});

// Accept Cross Origin Requests
app.use(cors());

// Validate the properties sent in the request
app.use(propsValidator);

app.get("/chat", (req, res) => {
    res.send("Welcome to Point Wizard. You can talk to me, but not here!");
});

app.get("/userData", (req, res) => {
    res.send(userData);
});

app.post("/chat", (req, res) => {
    // Validate the properties before creating and sending the message.
    try {
        console.log(req.body);
        const errors = validationResultFormatted(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }

        const props = req.body;
        const fromServer = userData;
        const dateFromServer = new MOMessage(props);
        const client = new TCPClient(options);
        res.send({
            props,
            DataFromServer: fromServer,
            date: dateFromServer,
            target: `${options.host}:${options.port}`
        });
    } catch (error) {
        console.log(error);
        if (error.name === "TypeError") {
            return res.status(400).send("There was a problem building the SBD");
        } else {
            return res.status(400).send("An error has occured");
        }
    }
});


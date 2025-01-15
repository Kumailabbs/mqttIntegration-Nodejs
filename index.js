require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const mqtt = require('mqtt');

const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});


const url = 'mqtts://your-ip:your-port';
const options = {
  username: 'username',
  password: 'password',
  reconnectPeriod: 1000, // Automatically reconnect after 1 second
};
// MQTT Broker connection
const client = mqtt.connect(url, options);

const topic = 'your-topic-name';

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message from topic:', topic, payload.toString())
})



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
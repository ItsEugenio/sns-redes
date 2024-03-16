
const express = require('express');
const app = express();

require('dotenv').config();

const AWS = require('aws-sdk');

const sns = new AWS.SNS({
    profile: process.env.PROFILE,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => res.json({status: "ok", sns: sns}));

app.listen(port, () => console.log(`SNS App en el puerto: ${port}!`));

app.post('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: 'temaredes',
        Endpoint: req.body.email
    };

    sns.subscribe(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });
});

app.post('/send', (req, res) => {
    let now = new Date().toString();
    let email = `${req.body.message} \n \n Enviado: ${now}`;
    let params = {
        Message: email,
        Subject: req.body.subject,
        TopicArn: 'temaredes'
    };

    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
});
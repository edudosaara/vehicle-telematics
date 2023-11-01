import express from 'express';
import { Readable } from 'stream';

const app = express();
const port = 3000;

const descriptionToTelematicsProportion = 0.1;
const messagesPerDay = 200000;

const randomString = (size: number, spaced: boolean=true, numbers: boolean=true) => {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numerics = "0123456789";
  const spaces = "            ";
  const alphanum = alpha + (numbers ? numerics : "") + (spaced ? spaces : "")
  return [...Array(size)].reduce((acc: string) => acc + alphanum[Math.floor(Math.random()*alphanum.length)], '');
}

const randomObj = () : {[key: string]: any} => {
  const objectLength = Math.ceil(Math.random()*10);
  return [...Array(objectLength)].reduce((acc: {[key: string]: any}) => {
    acc[randomString(7, false, false)] = randomString(Math.floor(Math.random()*20))
    return acc;
  }, {})
}

const messageStream = (descriptionProportion:number=descriptionToTelematicsProportion) => {
  return new Readable({
    read() {
      setTimeout(() => {
        let message: {[key: string]: any} = {
          "vehicle_id": Math.ceil(Math.random()*9999),
        }
        if (Math.random() > descriptionProportion) {
          message = {
            ...message,
            "timestamp": new Date().toISOString(),
            "location": {lat: -90 + Math.random()*180, lng: -180 + Math.random()*360 },
            "status": randomObj()
          }
        } else {
          message = {
            ...message,
            "description": randomString(140)
          }
        }
        this.push(JSON.stringify(message)+'\n')
      }, 86400000/messagesPerDay);
    }
  });
}

app.get('/', (req, res) => {
  try {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 'Transfer-Encoding': 'chunked'});
    const rs = messageStream();
    rs.pipe(res);
  } catch (e) {
    res.status(500).send("Service unavailable.")
  }
});

app.listen(port, () => {
  return console.log(`Mock Stream is listening at http://localhost:${port}`);
});

import { CollectorOptions, collect } from "./src";
import express from "express";

const app = express();

app.get('/', async (req, res) => {
  
  try {
    
    const URL = req.query.url;
    //const EMULATE_DEVICE = 'iPhone 13 Mini';

    console.log(`Beginning scan of ${URL}`);

    const config = {
        numPages: 3,
        headless: true,
    };
   
    const result = await collect(`${URL}`,config);
    console.log(result);

    res.json(result)
  
  } catch(error) {
    console.error(error);
  } 
});

var server = app.listen(3000, '0.0.0.0', () => {
   var host = server.address().address
   var port = server.address().port
   console.log("Blacklight Collector listening at http://%s:%s", host, port)
})

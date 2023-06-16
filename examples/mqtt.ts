//import { KnownDevices } from "puppeteer";
import { CollectorOptions, collect } from "./src";

const TOPIC_NAME = "blacklight";

var mqtt = require('mqtt');
var host = "127.0.0.1";
var mqttURL = "tcp://" + host;

function publishBlacklight(msg) {
    console.log("Trying to connect...");
    var client = mqtt.connect(mqttURL, {clientId: "blacklight-collector"});
    
    client.on('error', function(error) {
        console.log("Unable to connect: " + error);
        process.exit(1);
    });

    client.on('connect', function() {
        console.log("Is connected: " + client.connected);
        if (client.connected == true) {
            console.log("publishing message...");
            client.publish(TOPIC_NAME, msg);
            client.end();
        }
    });

    client.on('close', function(){
        console.log("Client disconnected.")
    });
}

(async () => {
    const URL = "https://example.com";
    //const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config: CollectorOptions = {
        numPages: 3,
        headless: true,
    };

    console.log(`Beginning scan of ${URL}`);

    const result = await collect(`${URL}`, config);
    console.log(result);
    const json = JSON.stringify(result);
  
    publishBlacklight(json);

})();


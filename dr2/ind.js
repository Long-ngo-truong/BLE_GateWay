const express = require('express');
const noble = require('@abandonware/noble');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 2000;
const host = '192.168.2.58'

//
const displayedDevices = {};
const characteristicData = {}; 
//Device lists
const bleFoundList = [];
const waitForConnectList = ['78:21:84:8e:1a:7e']; //Mac address want to connect. ( in UI, if you want to connect which device, when push the connect button, the mac will be into this list)
const bleConnectingList = [];
const bleConnectedList = []; // list for connected ble devices

//function parsed data
function parseData(data){
  const hexData = data.toString('hex');
  const parsedData = parsedInt(hexData, 16);
  return parsedData;
}
//function setup Socket IO
function setupSocketIO(){
  io.on('connection', (socket) => {
    console.log('Client connected !');
    socket.emit('bleFoundList', bleFoundList);
  })
 
  io.on('disconnect', () => {
    console.log('client disconnected !')
  })
}

//function for starting server
function startServer(){
  app.use(express.static(path.join(__dirname, 'ind.html')));
  server.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

//fuction scanning and connecting BLE 
function scanningAndconnecting() {
  let scanningTimeout;

  function scanDevices() {
    noble.startScanning();
    noble.on('discover', (peripheral) => {
      if (peripheral.advertisement.localName && !displayedDevices[peripheral.address]) {
        const device = {
          id: peripheral.id,
          address: peripheral.address,
          name: peripheral.advertisement.localName,
          rssi: peripheral.rssi,
        };
        displayedDevices[peripheral.id] = true;
        bleFoundList.push(device);
        bleFoundList.sort((a, b) => b.rssi - a.rssi);
        io.emit('bleFoundList', bleFoundList);
        console.log(bleFoundList)
      }

      if(waitForConnectList.includes(peripheral.address)){
        if(!bleConnectingList.includes(peripheral.address)){
          //connect
          console.log('connecting...');
          bleConnectingList.push(peripheral.address);
          peripheral.connect((error) => {
            if(error){
              console.log(error);
              return;
            }
            bleConnectedList.push(peripheral.address)
            console.log('Connected with:',peripheral.advertisement.localName)
            //Discover the services and characteristics
            peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
              if(error){
                console.log(error);
                return;
              }
              //use socket to send service, characteristic to server
              console.log('Discovered:', services, characteristics)
            })
          })
        }
      }
    });
  }

  function stopScanning() {
    noble.stopScanning();
    clearTimeout(scanningTimeout);
  }

  function scanInterval(interval, duration) {
    scanDevices();
    scanningTimeout = setTimeout(() => {
      stopScanning();
    }, duration);
    setInterval(() => {
      stopScanning();
      scanDevices();
    }, interval);
  }
  // Scan automatically for 10 seconds when the web is opened
  scanInterval(5000, 10000);

  // Start scanning for an additional 20 seconds when the scan button is clicked
 
}

//function to sign up for receiving the notification from characteristics
// function subcribeToNotification(charactertistics){
//   charactertistics.forEach((characteristic) => {
//     console.log(characteristic)
//     if(characteristic.properties.includes('notify')){
//       const characteristicUUID = characteristic.uuid;
//       if(!characteristicData[characteristicUUID]){
//         characteristicData[characteristicUUID] = {
//           characteristic: characteristic,
//           data: []
//         }
//       }
//       characteristic.on('data', (data) => {
//         characteristicData[characteristicUUID].data.push(data);
//       });
//       characteristic.subcribe((error) => {
//         if(error){
//           console.error(error);
//         }else{
//           console.log(`Subcribed to notifications for characteristics ${characteristicUUID}`);
//         }
//       })
//     }
//   })
// }

// //fuction for displaying the data from characteristics
// function displayDatafromCharacteristic(){
//   for (const characteristicUUID in characteristicData) {
//     const characteristic = characteristicData[characteristicUUID].characteristic;
//     const data = characteristicData[characteristicUUID].data
//   }
// }

//function start the app
function startApp(){
  setupSocketIO();
  startServer();
  scanningAndconnecting();
  // subcribeToNotification();
  // displayDatafromCharacteristic();
  
}

//start the process
startApp();
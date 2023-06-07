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
const rescanDeviceList = [];

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
    socket.on('rescan', () => {
      console.log('Rescanning...')
      bleFoundList = [];
      io.emit('bleFoundList', bleFoundList);
      scanningAndconnecting();
    })
  })
  io.on('disconnect', () => {
    console.log('client disconnected !')
  })
}

//function for starting server
function startServer(){
  app.use(express.static(path.join(__dirname, 'public')));
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
      if (peripheral.advertisement.localName && !displayedDevices[peripheral.advertisement.localName]) {
        const device = {
          id: peripheral.id,
          address: peripheral.address,
          name: peripheral.advertisement.localName,
          rssi: peripheral.rssi,
        };
        displayedDevices[peripheral.advertisement.localName] = true;
        bleFoundList.push(device);
        bleFoundList.sort((a, b) => b.rssi - a.rssi);
        io.emit('bleFoundList', bleFoundList);
        // console.log(bleFoundList)
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
              console.log('Discovered:');
              services.forEach((service) => {
                console.log('service UUID:', service.uuid);
                console.log('service type:', service.type);
                console.log('Service included services:', service.includedServices);
                // console.log('Service characteristics:', service.characteristics);
              });
              console.log('Discovered characteristics:');
              characteristics.forEach((characteristic) => {
              console.log('Characteristic name: ',characteristic.name);
              console.log('Characteristic UUID:', characteristic.uuid);
              console.log('Characteristic properties:', characteristic.properties);
              console.log('Characteristic descriptors:', characteristic.descriptors);
              });
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

  // function scanInterval(interval, duration) {
  //   scanDevices();
  //   scanningTimeout = setTimeout(() => {
  //     stopScanning();
  //   }, duration);
  //   setInterval(() => {
  //     stopScanning();
  //     scanDevices();
  //   }, interval);
  // }
  
  // Scan automatically for 10 seconds when the web is opened
  // scanInterval(1000, 5000);

  // Start scanning for an additional 20 seconds when the scan button is clicked
}

function scanInterval(interval, duration) {
  scanningAndconnecting();
  scanDevices();
  scanningTimeout = setTimeout(() => {
    stopScanning();
  }, duration);
  setInterval(() => {
    stopScanning();
    scanDevices();
  }, interval);
}



//function rescan

//function start the app
function startApp(){
  setupSocketIO();
  startServer();
  scanningAndconnecting();  
  
}

//start the process
startApp();
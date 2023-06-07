const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const noble = require('@abandonware/noble');

let isScanning = false;
const displayedDevices = {};

//list_saving_scanned_device
const scannedList = [];
const connectList = [];
const connectingList = [];
const bleDeviceList = [];

io.on('connection', (socket) => {
  console.log('A client connected.');

  socket.on('scan', () => {
    if (!isScanning) {
      console.log('Scanning started...');
      noble.on('discover', onDiscover);
      noble.startScanning([], true);
      isScanning = true;
    }
  });

  socket.on('stopScan', () => {
    if (isScanning) {
      console.log('Scanning stopped...');
      noble.stopScanning();
      isScanning = false;
    }
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
    if (isScanning) {
      console.log('Scanning stopped...');
      noble.stopScanning();
      isScanning = false;
    }
  });

  socket.on('connectToDevice', (device) => {
    noble.stopScanning();
    isScanning = false;

    console.log(`Connecting to device: ${device.name}, Address: ${device.address}`);
    connectToDevice(device);
  });
});


function connect(device) {
  connectingList.push(device)
  // device.peripheral ...
}

function onDiscover(peripheral) {
  if (peripheral.advertisement.localName && !displayedDevices[peripheral.id]) {
    const device = {
      id: peripheral.id,
      address: peripheral.address,
      name: peripheral.advertisement.localName,
      rssi: peripheral.rssi,
      peripheral: peripheral
    };

    displayedDevices[peripheral.id] = true;
    bleDeviceList.push(device);
    bleDeviceList.sort((a, b) => b.rssi - a.rssi);
    io.emit('bleDeviceList', bleDeviceList);
    // console.log(bleDeviceList)
  }
}

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log('Starting GATT connection...');
  }
});

function connectToDevice(mac) {
  let device = getDevice(mac);
  if (device != null) {
    // Todo connect
    connect(device);
  }
}

function getDevice(mac) {
  for (let i = 0; i < bleDeviceList.length; i++) {
    const device = bleDeviceList[i];
    if (device.address == mac) {
      return device;
    }
  }
  return null;
}

function getMac() {
  const peripheralMac = device.address;
  console.log(peripheralMac)
}

function Connection(peripheralMac){
  if(connectList.includes(peripheralMac)){
    console.log('connecting');
  }

}

app.use(express.static(__dirname,{index: 'ind.html'}));

const port = 3000;
const host = '192.168.2.58'
http.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

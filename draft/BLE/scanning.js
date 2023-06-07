const socket = io();

    // Event when pushing the scan Button
    document.getElementById('scanButton').addEventListener('click', () => {
      socket.emit('scan');

      // Set timeout for 60 seconds
      setTimeout(() => {
        socket.emit('stopScan');
      }, 60000);
    });

    // When receiving the BLE device info from the server 
    socket.on('device', (device) => {
      const deviceContainer = document.createElement('div');
      deviceContainer.classList.add('container', 'p-3', 'mb-3', 'bg-light');
      
      const deviceInfo = document.createElement('p');
      deviceInfo.innerText = `Name: ${device.name}, Address: ${device.address}, RSSI: ${device.rssi}`;

      const connectButton = document.createElement('button');
      connectButton.classList.add('btn', 'btn-primary');
      connectButton.innerText = 'Connect';

      deviceContainer.appendChild(deviceInfo);
      deviceContainer.appendChild(connectButton);
      document.getElementById('deviceList').appendChild(deviceContainer);
    });
# BLE Device Scanner

This is a Node.js script that scans for BLE (Bluetooth Low Energy) devices and provides a web-based interface to display the scanned devices in real-time.

## Prerequisites
- Node.js installed on your machine
- A compatible BLE adapter connected to your machine

## Getting Started
1. Clone or download the repository.

2. Install the required dependencies by running the following command:

3. Modify the `host` and `port` variables in `script.js` if needed. By default, the server will listen on `http://192.168.2.58:3001`.

4. Start the script by running the following command:

5. Open a web browser and navigate to the provided host and port (e.g., `http://192.168.2.58:3001`) to access the web interface.

## Usage
- Upon starting the script and accessing the web interface, the BLE scanner will automatically start scanning for devices.
- Scanned devices will be displayed in a table on the web interface in real-time.
- To manually trigger a device scan, click the "Scan Devices" button on the web interface.

## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

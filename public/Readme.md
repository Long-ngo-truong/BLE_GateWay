This file is for the view of BLE Gateway ( GUI )
Version 1.0.0 ( just display with a table which contained the information of BLE Device: local name, MAC address, rssi, advertisment).

1. The HTML structure is divided into the `<head>` and `<body>` sections.

2. Inside the `<head>` section:
   - The page title is set to "BLE Gateway".
   ( note: padding is the space between its content and its border )
   - The Bootstrap CSS stylesheet is included using a CDN link.
   - Some custom CSS styles are defined to set the background color and add padding to the container. ( table css )
   - Creating a table with border and using table css ( th, td, tr). The table will contain all the information of BLE devices. I will get 4 colunms for them: Device name, address, rssi and avertisment. 

3. Inside the `<body>` section: 
   - Title : BLE Device Scanner 
   - The scan button is created using the `<button>` element with the `<id>`: scanButton. I also use the Boostrap class "btn btn-primary"  and "table table-striped table-bordered" for styling 
   - The table header is defined within the <thead> element, with each column specified using `<th>` elements. 
   - The table body is initially empty and will be populated dynamically using Javascript.

4. Inside the `<script>` tag:
   - The `DOMContentLoaded` event listener is added to ensure that the JavaScript code is executed after the HTML has finished loading.
   - The `scanButton` and `deviceTable` elements are obtained using `getElementById`.
   - The `createTableRow` function is defined to create a new table row and populate it with device information.
   - An event listener is added to the `scanButton` to handle the button click event.
   - Inside the event listener, a `fetch` request is made to the "/devices" endpoint to retrieve the scanned device data.
   - The response data is parsed as JSON and used to populate the table dynamically.
   - The `createTableRow` function is called for each device in the response data, creating a new row in the table.


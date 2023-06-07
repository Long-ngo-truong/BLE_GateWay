1. // event when receiving the require for scanning BLE device
 Đoạn code trên xử lý một sự kiện có tên là "scan" được gửi qua socket. Khi sự kiện "scan" được nhận, đoạn code kiểm tra biến `isScanning` để đảm bảo rằng quá trình quét đang không diễn ra. Nếu `isScanning` có giá trị `false`, tức là không có quá trình quét nào đang diễn ra, đoạn code sẽ tiến hành bắt đầu quá trình quét.

Cụ thể, đoạn code thực hiện các bước sau:

- In ra thông báo "Scanning started..." thông qua `console.log()` để chỉ ra rằng quá trình quét đã được bắt đầu.
-  Đăng ký một hàm xử lý sự kiện `'discover'` thông qua `noble.on('discover', onDiscover)` để xử lý mỗi lần một thiết bị được phát hiện trong quá trình quét.
-  Gọi `noble.startScanning([], true)` để bắt đầu quá trình quét các thiết bị BLE (Bluetooth Low Energy). Tham số đầu tiên là một mảng chứa các UUID của các dịch vụ cụ thể để chỉ quét các thiết bị hỗ trợ các dịch vụ đó. Trong trường hợp này, mảng rỗng `[]` cho biết quét tất cả các dịch vụ có sẵn trên các thiết bị BLE. Tham số thứ hai `true` cho biết rằng quá trình quét sẽ tiếp tục cho đến khi được dừng lại bởi một lời gọi hàm `noble.stopScanning()`.
- Gán giá trị `true` cho biến `isScanning` để đánh dấu rằng quá trình quét đang diễn ra.

Tóm lại, khi nhận được sự kiện "scan" thông qua socket, đoạn code trên bắt đầu một quá trình quét các thiết bị BLE nếu không có quá trình quét nào đang diễn ra.


2. Phần stopScanning():
- Khi nhận được sự kiện stopScan từ client, chúng ta kiểm tra biến isScanning để đảm bảo rằng đang trong trạng thái quét BLE (isScanning là true). Nếu đúng, chúng ta dừng quét BLE bằng cách sử dụng noble.stopScanning(), sau đó đặt biến isScanning thành false để chỉ ra rằng quét BLE đã dừng.

- Khi nhận được sự kiện disconnect từ client, chúng ta kiểm tra biến isScanning để đảm bảo rằng đang trong trạng thái quét BLE (isScanning là true). Nếu đúng, chúng ta cũng dừng quét BLE bằng cách sử dụng noble.stopScanning(), sau đó đặt biến isScanning thành false.

- Điều này đảm bảo rằng nếu client ngắt kết nối hoặc gửi yêu cầu dừng quét BLE, chúng ta sẽ dừng quét BLE nếu đang trong trạng thái quét (isScanning là true), giúp tiết kiệm tài nguyên và tránh việc quét tiếp tục mà không cần thiết.


3. function onDiscover ( finding BLE Device)
Trong đoạn mã `onDiscover`, chúng ta đang xử lý sự kiện khi tìm thấy một BLE device mới. Đầu tiên, chúng ta kiểm tra xem device có local name không (`peripheral.advertisement.localName`) và chưa được hiển thị trước đó (`!displayedDevices[peripheral.address]`).

- `peripheral.advertisement.localName` là một thuộc tính của đối tượng `peripheral.advertisement` và chứa tên định danh (local name) của BLE device. Bằng cách kiểm tra điều kiện này, chúng ta chỉ lấy những device có tên định danh.

- `displayedDevices` là một đối tượng sử dụng để theo dõi các device đã được hiển thị trước đó. Đối tượng này có các thuộc tính dưới dạng key-value, trong đó key là địa chỉ (address) của device và value là một giá trị boolean. Nếu giá trị tương ứng với địa chỉ device là `true`, tức là device đã được hiển thị trước đó.

Nếu device thỏa mãn cả hai điều kiện trên, chúng ta tạo một đối tượng `device` mới chứa thông tin về device đó, bao gồm `name` (tên định danh), `address` (địa chỉ) và `rssi` (cường độ tín hiệu). Tiếp theo, chúng ta đánh dấu device đã được hiển thị bằng cách đặt giá trị `true` cho khóa tương ứng trong `displayedDevices`. Sau đó, chúng ta gửi thông tin BLE device tới client thông qua sự kiện `device` của Socket.IO (`io.emit('device', device)`).

3. Mỗi thiết bị BLE hiển thị trên 1 container chứa nút connect 
đã thêm Bootstrap vào trang web bằng cách sử dụng đường dẫn CSS từ CDN (<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">). Đồng thời, chúng tôi đã thay đổi cách hiển thị các BLE device bằng cách tạo một container (div) cho mỗi thiết bị. Container này có background màu nhạt (bg-light) và padding (p-3), và chứa thông tin về thiết bị và nút "Connect".
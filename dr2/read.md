fuction Scanning():
- có 1 nút Button: user chủ động bấm scan 
- khi vừa mở web, tự động scan trong vòng 10 giây ( timeout = 10s )
- nếu nhấn scanButton, scan trong vòng 20s nữa, mỗi lần 5s
- hàm scanInterval để quét các thiết bị BLE trong khoảng thời gian được chỉ định và với khoảng thời gian giữa các lần quét cũng được chỉ định. Hàm này sẽ được gọi để thực hiện quét tự động trong vòng 10 giây khi web được mở và sẽ được gọi lại khi nhấn vào nút quét để thực hiện quét trong thêm 20 giây nữa, mỗi 5 giây một lần. ( hiện chưa define cho quét khi nhấn nút )


2. tại phần connectToDevice
- const peripheral = noble.Peripheral.getByAddress(macAddress); - Đoạn code này sử dụng noble.Peripheral.getByAddress để tìm thiết bị BLE có địa chỉ MAC tương ứng. Nếu thiết bị không được tìm thấy, một thông báo lỗi sẽ được hiển thị.

peripheral.connect((error) => { ... }); - Sau khi tìm thấy thiết bị, hàm connect được gọi để kết nối đến thiết bị đó. Điều này được thực hiện thông qua phương thức connect của đối tượng peripheral. Nếu có lỗi xảy ra trong quá trình kết nối, thông báo lỗi sẽ được hiển thị.

Trong phần // Do further operations with the connected peripheral, bạn có thể thực hiện các hoạt động khác với thiết bị BLE đã kết nối. Đây là nơi bạn có thể thực hiện việc tìm kiếm dịch vụ và thuộc tính, gửi và nhận dữ liệu, và thực hiện các thao tác BLE khác.
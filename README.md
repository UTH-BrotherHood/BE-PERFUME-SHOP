# BE-PERFUME-SHOP

<b>Clone Project</b>

```shell
git clone https://github.com/UTH-BrotherHood/BE-PERFUME-SHOP.git
```

<b>Cài đặt các gói phụ thuộc (dependencies) của dự án</b>


```shell
npm i
```


## Diagram

[[Database Diagram]](https://drive.google.com/file/d/1k9zk4nAovzhe9ZmbbbHEmulDzb1u-Rmf/view)

## Hệ Quản Trị Cơ Sở Dữ Liệu

**PostgreSQL**


## Ngôn Ngữ

**Express, TypeScript**

## Quy Tắc

- Code theo một kiểu thống nhất:
  - Tên file viết thường, tên biến và body request kiểu `Snake Case` (ví dụ: `this_is_snake_case`, `THIS_IS_SCREAMING_SNAKE_CASE`).
- Sau khi code xong, hãy push lên nhánh `temp`. Sau đó, nếu tất thành viên trong nhóm thống nhất, thì mới merge vô nhánh `main`.


## Docs
**PostgreSQL**

- sử dụng postgresql , mọi người ai chưa tải thì xem hướng dẫn <a href="https://www.youtube.com/watch?v=7w06A_BImxE">Tại đây</a> ( nhớ note lại mật khẩu nha ae , quên là hết cíu )
- tạo database đặt tên là  `PERFUME-SHOP`
- anh em tự vô file .env để chỉnh lại mật khẩu của anh em nha ở phần `DB_PASSWORD`
- sau đó vô source ctrl + s file index sẽ tự tạo bảng cho anh em


![image](https://github.com/UTH-BrotherHood/BE-PERFUME-SHOP/assets/110114506/b084a2df-ee85-4fbb-adfd-ced9600378e2)


**Postman**
- mở postman import file `src/models/postman/PERFUME-SHOP.postman_collection.json` vào phần `Collections` , và import file `src/models/postman/PERFUME-SHOP-ENV.postman_environment.json` vào phần `Environments`
- sau đó ở góc trên bên phải ứng dụng postman anh em chọn `PERFUME-SHOP-ENV` như hình bên dưới

![image](https://github.com/UTH-BrotherHood/BE-PERFUME-SHOP/assets/110114506/a17733b0-482a-491b-9493-4c7a68ec9c60)

- sau đó sử dụng như bình thường , khi có thay đổi tui sẽ commit update lên github cho ae đỡ mất thời gian
- nếu bị trục trặc thì mọi người vô file `routes` cũng có note hết phần method , header, requestbody, ... sẳn , rồi mọi người tự làm trong postman cũng được


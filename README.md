# 一个简单使用示例

后端 Hyperf,前端 Angular + NG-ZORRO

# 安装要求

## 后端 

 - PHP >= 7.3
 - Swoole PHP extension >= 4.5，and Disabled `Short Name`
 - OpenSSL PHP extension
 - JSON PHP extension
 - PDO PHP extension

## 前端

- NODEJS >= 12

# 安装

1. 后端

```
将casbin_example.sql导入mysql
cd hyperf
复制 .env.example 为.env 并配置好数据库连接
composer install
composer server
```
2. 前端

```
cd angular
npm install
npm start
```

# 访问

访问 http://localhost:4200 用户名:admin 密码:123456
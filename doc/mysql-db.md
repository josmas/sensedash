# MySQL setup

In MySQL you need to define database config in config/config.js

```console
"mysql_ip": "hostname",
"mysql_port": "portnumber",
"mysql_user": "username",
"mysql_pass": "password",
"mysql_database": "mydb",
```

# MySQL setup

Ubuntu:

```console
sudo apt-get update
sudo apt-get install mysql-server
mysql_secure_installation
```

* https://dev.mysql.com/downloads/installer/

# AWS configure security groups

// todo: write better
* Open mysql port
* open ports for internal communication

# MySQL cluster setup

Configure & install

install cluster:
https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-install-linux.html

configure cluster:
https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-install-configuration.html

start cluster:
https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-install-first-start.html


* https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-installation.html

# Create user and database

In Linux terminal type:
```console
mysql
```

Then in MySQL client type following and replace username, password and mydb to match your preferences:
```console
CREATE DATABASE `mydb`;
CREATE USER 'username' IDENTIFIED BY 'password';
GRANT USAGE ON *.* TO 'username'@'%' IDENTIFIED BY 'password';
GRANT ALL privileges ON `mydb`.* TO 'username'@%;
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'myuser'@localhost;
```
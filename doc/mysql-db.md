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

## install

for all nodes:

```console
sudo apt update
sudo apt-get install python-paramiko libclass-methodmaker-perl
wget https://dev.mysql.com/get/mysql-apt-config_0.8.9-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.9-1_all.deb
```
choose “mysql-cluster-x.y

sql nodes:

```console
sudo apt-get update
sudo apt-get install mysql-cluster-community-server
```

mgm nodes:

```console
sudo apt-get update
sudo apt-get install mysql-cluster-community-management-server
```

data nodes:

```console
sudo apt-get update
sudo apt-get install mysql-cluster-community-data-node
```

## configure

for each data node and sql node:
```console
sudo nano /etc/my.cnf
```
modify to look like this:
```
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

management node


```console
sudo mkdir /var/lib/mysql-cluster
cd /var/lib/mysql-cluster
sudo nano config.ini
```

modify to look like this:
```
[ndbd default]
# Options affecting ndbd processes on all data nodes:
NoOfReplicas=2    # Number of replicas
DataMemory=80M    # How much memory to allocate for data storage
IndexMemory=18M   # How much memory to allocate for index storage
                  # For DataMemory and IndexMemory, we have used the
                  # default values. Since the "world" database takes up
                  # only about 500KB, this should be more than enough for
                  # this example NDB Cluster setup.
ServerPort=2202   # This the default value; however, you can use any
                  # port that is free for all the hosts in the cluster
                  # Note1: It is recommended that you do not specify the port
                  # number at all and simply allow the default value to be used
                  # instead
                  # Note2: The port was formerly specified using the PortNumber 
                  # TCP parameter; this parameter is no longer available in NDB
                  # Cluster 7.5.

[ndb_mgmd]
# Management process options:
HostName=198.51.100.10          # Hostname or IP address of MGM node
DataDir=/var/lib/mysql-cluster  # Directory for MGM node log files

[ndbd]
# Options for data node "A":
                                # (one [ndbd] section per data node)
HostName=198.51.100.30          # Hostname or IP address
NodeId=2                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[ndbd]
# Options for data node "B":
HostName=198.51.100.40          # Hostname or IP address
NodeId=3                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[mysqld]
# SQL node options:
HostName=198.51.100.20          # Hostname or IP address
                                # (additional mysqld connections can be
                                # specified for this node for various
                                # purposes such as running ndb_restore)
```

reference:
https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-installation.html

## cluster startup

management node:

```console
sudo ndb_mgmd -f /var/lib/mysql-cluster/config.ini
```

data nodes:

```console
sudo mkdir -p /usr/local/mysql/data
sudo ndbd
```

sql node:

use startup script provided by package

## verify

management:
```console
sudo apt install mysql-client
sudo ndb_mgm
```
type show

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
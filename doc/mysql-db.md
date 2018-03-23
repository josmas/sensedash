# MySQL setup

## Introduction
This document covers setting up MySQL cluster to AWS EC2 service. In this example we use  Ubuntu Server 16.04 LTS (HVM), SSD Volume Type - ami-1b791862 as machine image. Instance type used is t2.micro which has 1 GiB memory and 1 vCPU. Four different instances are created and they are allowed to communicate with each other in same AWS security group. For SQL node (api endpoint) instance mysql port 3306 needs to be opened in order to allow access outside AWS EC2 service. For this purpose new security needs to be created for this purpose and SQL needs to be assigned to that security group.

## Nodes

There are three different types of nodes in cluster. Our example cluster consists of two data nodes, one sql node and management node. 

In data nodes ndbd process handles data in tables using NDB Cluster storage engine. ndbd process takes handles tasks related to node recovery, distributed transaction handling etc. On startup two processes are initiated by ndbd: first one is named "angel process" and its purpose is to discover when execution process is finished and then restart ndbd process if configured to do so.
(https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster-programs-ndbd.html)

in Sql endpoint node Mysql daemon (mysqld) is running. Purpose of mysqld is to manage access to data directory containing tables and databases. (https://dev.mysql.com/doc/refman/5.7/en/mysqld.html)

# AWS configure security groups

In AWS security groups for instances need to be configured properly. In current setting all traffic is allowed within security group so nodes can communicate with each other. Ssh connections (port 22) should be opened so cluster nodes can be configured remotely.

For SQL node port 3306 need to be opened in order to allow incoming connection to MySQL daemon.

# MySQL cluster setup

In this setup four nodes need to be configured. There are different options for installing MySQL NDB: installing from sources, installing from binaries, installing from apt sources etc. In current example installation from apt source is used.

## Install

Following commands are executed in all four nodes.

```console
sudo apt update
sudo apt-get install python-paramiko libclass-methodmaker-perl
wget https://dev.mysql.com/get/mysql-apt-config_0.8.9-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.9-1_all.deb
```
Choose “mysql-cluster-7.5

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

# Certificate

```console
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly
```

Edit /etc/mysql/my.cnf and add the following lines to the [mysqld] section:
bind-address = 1.2.3.4
ssl-cert=/etc/mysql/fullchain.pem
ssl-key=/etc/mysql/privkey.pem
Substitute 1.2.3.4 with the IP address of your server.
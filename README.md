# sensedash

Sensedash system consists of Docker containers running in Docker swarm. Each container is running nodejs and nodejs has workers equal to amount of CPU cores of machine. This make system highly available. Nodejs workers are communicating with Sql node and data is saved in MySQL NDB cluster. Using cluster instead of single mysql server also increases availability and performance.

![Architecture](images/architecture.png "Architecture")

## Get started

### Database

First step to get started is setting up database. MySQL NDB database setup documentation is provided as an example:
* [MySQL setup](doc/mysql-db.md)

### Installation

Docker is used for containerization.

Install Docker:
```console
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
```

Clone repository and change directory
```console
git clone git@github.com:awareframework/sensedash.git
cd sensedash
```

Configuration file is needed so server component knows database connection credentials and details. Configuration file is located in config/config.json in project directory.

Create config file
```console
nano config/config.json
```

Following is an example of configuration file. Element "config" can be fetched from server component issuing GET request to /config endpoint and it is viewed publicly. Other details like study_id, mysql_ip, mysql_port, mysql_user, mysql_pass and mysql_database are private and are not shown from /config endpoint. These private details are used for database communication.

Example (replace with correct variables):
```
{
  "study_id": "id",
  "api_key": "apikey",
  "mysql_ip": "host_ip",
  "mysql_port": "host_port",
  "mysql_user": "mysql_username",
  "mysql_pass": "mysql_password",
  "mysql_database": "mysql_dbname",
  "config": {
    "study_id": "xxx"
  }
}
```

Certificates are necessary to run the server. The app expects the following files to exist in the node container:
```
  /run/secrets/fullchain.pem
  /run/secrets/privkey.pem
```

The location and names of the files can be customised in [start.js](start.js). The files can be hosted locally within the app in a folder called `./sslcert/` which is already added to .gitignore.

Build dockerimage with following command:
```console
docker build -t nodejs-server .
```

### Running

Single docker container can be used to test if the component is working properly.

Run opening port 3000 from container:
```console
docker run -it --rm -p 3000:3000 --name server nodejs-server
```

### Installation using docker-compose

You can also use docker-compose to run. If certificates exist in `./sslcert/` they will be mapped to the appropriate path in the container.

```console
docker-compose up
```

### Run with Docker swarm

Docker swarm provides native clustering functionality for Docker containers. With docker swarm it is possible to turn multiple docker engines into single virtual engine. Docker swarm is used in this project to increase scalability, availability and performace.

* [Setup Docker swarm](doc/docker-swarm.md)

### Debug 

```console
DEBUG=app npm start
```

## Database support

In current project knex is used for database communication. Knex support several different databases but this project officially supports only MySQL v5.7 +.

## Requirements

* [Node.js](https://nodejs.org/en/) v6.11.4 +
* [MySQL](https://www.mysql.com/) v5.7 +
* [docker-compose](https://docs.docker.com/compose/) v1.16.1 +
* [docker](https://www.docker.com/) v17.09.0 +
* [Ubuntu Server](https://www.ubuntu.com/)  16.04 LTS

## Authors

* **Mikko Yliniemi** - *Initial work* - [mikkoyli](https://github.com/mikkoyli)

## License

This project is licensed under the APACHE 2.0 License - see the [LICENSE](LICENSE) file for details


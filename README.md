# sensedash

** Under development, not ready for production **

## Get started

Clone repository
```console
git clone git@github.com:awareframework/sensedash.git
```

Use sample knexfile and make modifications to match it your environment.
```console
$ cp knexfile_sample.js knexfile.js
```

### Docker

Build:
```console
docker build -t node-web-app .
```

Run:
```console
docker run -it --rm -p 3000:3000 -e DB_HOST=mysql -e DB_USER=dbuser -e DB_PASSWORD=password -e NODE_ENV=production --name my-nodejsapp node-web-app
```

### Using docker-compose

You can also use docker-compose to run.
In this setting node environment is set to production as default: NODE_ENV=production

```console
docker-compose up
```

## Running tests

Run tests with
```console
$ npm test
```

## Requirements

* [Node.js](https://nodejs.org/en/) v6.11.4 +
* [MySQL](https://www.mysql.com/) v5.7 +
* [docker-compose](https://docs.docker.com/compose/) v1.16.1 +
* [docker](https://www.docker.com/) v17.09.0 +

## Authors

* **Mikko Yliniemi** - *Initial work* - [mikkoyli](https://github.com/mikkoyli)

## License

This project is licensed under the APACHE 2.0 License - see the [LICENSE](LICENSE) file for details


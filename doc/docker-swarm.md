# Docker Swarm setup

With Docker swarm mode it is possible to manage containers across multiple host machines. There are two types of nodes: manager for performing cluster management and orchestration related tasks and worker for performing tasks given by manager. By default manager nodes are also workers.

In this example three t2.micro nodes are created in AWS EC2. It is necessary to allow nodes to communicate with each others within same security group.

You should already have built Docker image of sensedash nodejs component. You should push image to Docker cloud. Later you can fetch image from AWS server. Execute following in your local host and replace with corrent variables.
```console
docker tag image username/sensedash-server:tag
docker push username/sensedash-server:tag
```

Run for all nodes:

```console
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
```

Run in node1:
Get ip address
```console
ifconfig
```

Execute following with IP-ADDRESS replaced with ip address of eth0 from previous command
```console
sudo docker swarm init --advertise-addr IP-ADDRESS
sudo docker swarm join-token manager
```

Run in node2 and node3 and replace token with TOKEN given by previous command. You can also copy paste command given to you by previous command in node1.
```console
sudo docker swarm join \
    --token TOKEN \
    IP-ADDRESS
```

Run in node1 to verify
```console
sudo docker node ls
```

Should look like this:
```console
ID                           HOSTNAME          STATUS  AVAILABILITY  MANAGER STATUS
6crtydhw43s1kctdmru6ds7xe *  ip-172-31-36-214  Ready   Active        Leader
ndx5kqu342xnx9118p0bx705d    ip-172-31-47-43   Ready   Active        Reachable
pifoy2gkumzji93fgrb31q1z1    ip-172-31-44-12   Ready   Active        Reachable
```

Create overlay netork
```console
[node1]$ sudo docker network create --driver overlay nodejs
```

```console
sudo docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
3bcb12244ed8        bridge              bridge              local
33e7af5c0fad        docker_gwbridge     bridge              local
e7955de7349b        host                host                local
hixshfpdbib3        ingress             overlay             swarm
2dr2bo2t5bxw        mynet               overlay             swarm
9wh7tll73mj1        nodejs              overlay             swarm
c106df3625a6        none                null                local
```

Docker secrets can be used by containers running in Docker swarm. You must use docker secrets to make certificate files created with certbot to be available inside containers.

Create docker secrets
```console
sudo docker secret create fullchain.pem /etc/letsencrypt/live/YOUR-DOMAIN-PATH/fullchain.pem
sudo docker secret create privkey.pem /etc/letsencrypt/live/YOUR-DOMAIN-PATH/privkey.pem
sudo docker secret create ca.pem ca.pem
sudo docker secret create client-cert.pem client-cert.pem
sudo docker secret create client-key.pem client-key.pem
```

Create docker service
```console
sudo docker service create \ 
--replicas 3 \
--secret fullchain.pem \
--secret privkey.pem \
--network nodejs \
-p 443:8443 \
--with-registry-auth \
username/repository:tag
```

Yuo should now be allow to access running container from https://address/

Reference:
https://severalnines.com/blog/mysql-docker-introduction-docker-swarm-mode-and-multi-host-networking
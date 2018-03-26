# Docker Swarm setup

With Docker swarm mode it is possible to manage containers across multiple host machines. There are two types of nodes: manager for performing cluster management and orchestration related tasks and worker for performing tasks given by manager. By default manager nodes are also workers.

Create three ndoes in AWS EC2.

You should already have built Docker image of sensedash nodejs component. You should push image to Docker cloud. Later you can fetch image from AWS server. Execute following in your local host and replace with corrent variables.
```console
docker tag image username/sensedash-server:tag
docker images
docker push username/sensedash-server:tag
```

Run for all nodes:
```console
sudo apt update
sudo apt install docker.io
```

Run in node1
```console
sudo docker swarm init --advertise-addr IP-ADDRESS
sudo docker swarm join-token manager
```

Run in node2 and node3
```console
sudo docker swarm join \
    --token SWMTKN-1-16kit6dksvrqilgptjg5pvu0tvo5qfs8uczjq458lf9mul41hc-7fd1an5iucy4poa4g1bnav0pt \
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

todo : write something about what is etcd and why it is needed
```console
[node1]$ curl -w "\n" 'https://discovery.etcd.io/new?size=1'
https://discovery.etcd.io/78573ea75bd18d13ddabcf4bc300bbc0
```

```console
[node1]$ sudo docker service create \
--name etcd \
--replicas 1 \
--network mynet \
-p 2379:2379 \
-p 2380:2380 \
-p 4001:4001 \
-p 7001:7001 \
elcolio/etcd:latest \
-name etcd \
-discovery=https://discovery.etcd.io/78573ea75bd18d13ddabcf4bc300bbc0
```

```console
sudo docker service create --replicas 3 --network nodejs -p 3000:3000 --with-registry-auth username/repository:tag
```

Yuo should now be allow to access running container from http://address:3000/

Reference:
https://severalnines.com/blog/mysql-docker-introduction-docker-swarm-mode-and-multi-host-networking
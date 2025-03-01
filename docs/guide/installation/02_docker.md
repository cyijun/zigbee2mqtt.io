---
next: ../configuration/
---

# Docker
It is possible to run Zigbee2MQTT in a Docker container using the official [Zigbee2MQTT Docker image](https://hub.docker.com/r/koenkk/zigbee2mqtt/).

This image support the following architectures: `386`, `amd64`, `arm/v6`, `arm/v7`, `arm64`.
Since Zigbee2MQTT images are manifest listed, Docker will auto-detect the architecture and pull the right image.

Note for Raspberry Pi 1 and zero users: there is a bug in Docker which selects the wrong image architecture.
Before executing `docker run` pull the correct image with `docker pull koenkk/zigbee2mqtt --platform linux/arm/v6`.

Start by figuring out the location of your adapter as explained [here](./01_linux.md#determine-location-of-the-adapter-and-checking-user-permissions).

## Creating the initial configuration
Navigate to the directory where you whish to store the Zigbee2MQTT data and execute:

```bash
wget https://raw.githubusercontent.com/Koenkk/zigbee2mqtt/master/data/configuration.yaml -P data
```

Now configure the MQTT server and adapter location as explained [here](./01_linux.md#configuring).

## Running the container

Execute the following command, update the `--device` parameter to match the location of your adapter.

```bash
$ docker run \
   --device=/dev/ttyACM0 \
   -v $(pwd)/data:/app/data \
   -v /run/udev:/run/udev:ro \
   -e TZ=Europe/Amsterdam \
   koenkk/zigbee2mqtt
```

**Parameters explanation:**  
* `--device=/dev/ttyACM0`: Location of adapter (e.g. CC2531)
* `-v $(pwd)/data:/app/data`: Directory where Zigbee2MQTT stores it configuration (pwd maps to the current working directory)
* `-v /run/udev:/run/udev:ro`: only required for auto-detecting the port and some adapters like ConBee
* `-e TZ=Europe/Amsterdam`: Configure the timezone

::: tip
If you run the MQTT-Server on the same host (localhost) you could use the IP
of the `docker0` bridge to establish the connection: `server: mqtt://172.17.0.1`.
:::

### Rootless container

To improve the security of the deployment you may want to run Zigbee2MQTT as a _non-root_ user.

1. Identify the group that has access to the adapter (in Ubuntu, e.g. it might be assigned to `dialout`). Update `ttyACM0` to match your adapter location.
```
$ ls -l /dev/ttyACM0
crw-rw---- 1 root dialout 166, 0 Nov 5 16:31 /dev/ttyACM0
```

2. If you want to run Zigbee2MQTT using your current user find the `uid` (UserID) and `gid` (GroupID): 
```
$ id
uid=1001(pi) gid=1001(pi) Groups=...
```

3. Start the docker container after updating  `device`, `user` (uid:gid) and `group-add`:
```
$ sudo docker run \
   --name=zigbee2mqtt \
   -v ($pwd)/data:/app/data \
   -v /run/udev:/run/udev:ro \
   --device=/dev/ttyACM0 \
   --user 1001:1001 \
   --group-add dialout \
   -e TZ=Europe/Amsterdam \
   koenkk/zigbee2mqtt
```

**Parameters explanation:**  
* `--user 1001:1001`: Run the Zigbee2MQTT process within the container using the provided UserID and GroupID
* `--group-add dialout`: Assign the `dialout` group to the user to be able to access the device 


## Updating
To update to the latest Docker image:
```bash
docker pull koenkk/zigbee2mqtt:latest
docker rm -f zigbee2mqtt
# Now run the container again with the instructions above
```

## Tags
The following tags are available:
- Latest release version: `latest`
- Latest dev version (based on [`dev`](https://github.com/Koenkk/zigbee2mqtt/tree/dev) branch): `latest-dev`
- Specific release version, e.g: `1.7.0`


## Docker Compose

Example of a Docker Compose file:

```yaml
version: '3.8'
services:
  zigbee2mqtt:
    container_name: zigbee2mqtt
    image: koenkk/zigbee2mqtt
    restart: unless-stopped
    volumes:
      - ./data:/app/data
      - /run/udev:/run/udev:ro
    ports:
      # Frontend port
      - 8080:8080
    environment:
      - TZ=Europe/Berlin
    devices:
      # Make sure this matched your adapter location
      - /dev/ttyUSB0:/dev/ttyACM0
```

You can also run a rootless container with docker-compose by adding the required attributes to the `zigbee2mqtt` service block in your `docker-compose-yml`:

```yaml
    group_add:
      - dialout
    user: 1000:1000
```

## Docker Stack device mapping
*This is only relevant when using Docker Stack*

Docker stack doesn't support device mappings with option `--devices` when deploying a stack in Swam mode. A workaround is to bind the device as volume binding and set the right permissions.

The workaround is based on the solution found at [Add support for devices with "service create"](https://github.com/docker/swarmkit/issues/1244#issuecomment-285935430), all credits goes this him.

1. Identify serial adapter
	Identify the serial adapter using the following command:

	```shell
	sudo lsusb -v
	```

	```
	Bus 001 Device 005: ID 0451:16a8 Texas Instruments, Inc.
	Device Descriptor:
	  bLength                18
	  bDescriptorType         1
	  bcdUSB               2.00
	  bDeviceClass            2 Communications
	  bDeviceSubClass         0
	  bDeviceProtocol         0
	  bMaxPacketSize0        32
	  idVendor           0x0451 Texas Instruments, Inc.
	  idProduct          0x16a8
	  bcdDevice            0.09
	  iManufacturer           1 Texas Instruments
	  iProduct                2 TI CC2531 USB CDC
	  iSerial                 3 __0X00124B001936AC60
	  bNumConfigurations      1
	  Configuration Descriptor:
		bLength                 9
		bDescriptorType         2
		wTotalLength           67
		bNumInterfaces          2
		bConfigurationValue     1
		iConfiguration          0
		bmAttributes         0x80
		  (Bus Powered)
		MaxPower               50mA
		Interface Descriptor:
		  bLength                 9
		  bDescriptorType         4
		  bInterfaceNumber        0
		  bAlternateSetting       0
		  bNumEndpoints           1
		  bInterfaceClass         2 Communications
		  bInterfaceSubClass      2 Abstract (modem)
		  bInterfaceProtocol      1 AT-commands (v.25ter)
		  iInterface              0
		  CDC Header:
			bcdCDC               1.10
		  CDC ACM:
			bmCapabilities       0x02
			  line coding and serial state
		  CDC Union:
			bMasterInterface        0
			bSlaveInterface         1
		  CDC Call Management:
			bmCapabilities       0x00
			bDataInterface          1
		  Endpoint Descriptor:
			bLength                 7
			bDescriptorType         5
			bEndpointAddress     0x82  EP 2 IN
			bmAttributes            3
			  Transfer Type            Interrupt
			  Synch Type               None
			  Usage Type               Data
			wMaxPacketSize     0x0040  1x 64 bytes
			bInterval              64
		Interface Descriptor:
		  bLength                 9
		  bDescriptorType         4
		  bInterfaceNumber        1
		  bAlternateSetting       0
		  bNumEndpoints           2
		  bInterfaceClass        10 CDC Data
		  bInterfaceSubClass      0 Unused
		  bInterfaceProtocol      0
		  iInterface              0
		  Endpoint Descriptor:
			bLength                 7
			bDescriptorType         5
			bEndpointAddress     0x84  EP 4 IN
			bmAttributes            2
			  Transfer Type            Bulk
			  Synch Type               None
			  Usage Type               Data
			wMaxPacketSize     0x0040  1x 64 bytes
			bInterval               0
		  Endpoint Descriptor:
			bLength                 7
			bDescriptorType         5
			bEndpointAddress     0x04  EP 4 OUT
			bmAttributes            2
			  Transfer Type            Bulk
			  Synch Type               None
			  Usage Type               Data
			wMaxPacketSize     0x0040  1x 64 bytes
			bInterval               0
	Device Status:     0x0000
	  (Bus Powered)
	```

2. UDEV Rules

	Create a new udev rule for serial adpater, `idVendor` and `idProduct` must be equal to values from `lsusb` command. The rule below creates device `/dev/zigbee-serial`:

	```shell
	echo "SUBSYSTEM==\"tty\", ATTRS{idVendor}==\"0451\", ATTRS{idProduct}==\"16a8\", SYMLINK+=\"zigbee-serial\",  RUN+=\"/usr/local/bin/docker-setup-zigbee-serial.sh\"" | sudo tee /etc/udev/rules.d/99-zigbee-serial.rules
	```

	Reload newly created rule using the following command:

	```shell
	sudo udevadm control --reload-rules
	```

3. Create docker-setup-zigbee-serial.sh

	```shell
	sudo nano /usr/local/bin/docker-setup-zigbee-serial.sh
	```

	Copy the following content:

	```shell
	#!/bin/bash
	USBDEV=`readlink -f /dev/zigbee-serial`
	read minor major < <(stat -c '%T %t' $USBDEV)
	if [[ -z $minor || -z $major ]]; then
		echo 'Device not found'
		exit
	fi
	dminor=$((0x${minor}))
	dmajor=$((0x${major}))
	CID=`docker ps -a --no-trunc | grep koenkk/zigbee2mqtt | head -1 |  awk '{print $1}'`
	if [[ -z $CID ]]; then
		echo 'CID not found'
		exit
	fi
	echo 'Setting permissions'
	echo "c $dmajor:$dminor rwm" > /sys/fs/cgroup/devices/docker/$CID/devices.allow
	```

	Set permissions:

	```shell
	sudo chmod 744 /usr/local/bin/docker-setup-zigbee-serial.sh
	```

4. Create docker-event-listener.sh

	```shell
	sudo nano /usr/local/bin/docker-event-listener.sh
	```

	Copy the following content:

	```shell
	#!/bin/bash
	docker events --filter 'event=start'| \
	while read line; do
		/usr/local/bin/docker-setup-zigbee-serial.sh
	done
	```
	Set permissions:

	```shell
	sudo chmod 744 /usr/local/bin/docker-event-listener.sh
	```

5. Create docker-event-listener.service

	```shell
	sudo nano /etc/systemd/system/docker-event-listener.service
	```

	Copy the following content:

	```shell
	[Unit]
	Description=Docker Event Listener for Zigbee serial adapter
	After=network.target
	StartLimitIntervalSec=0
	[Service]
	Type=simple
	Restart=always
	RestartSec=1
	User=root
	ExecStart=/bin/bash /usr/local/bin/docker-event-listener.sh

	[Install]
	WantedBy=multi-user.target
	```

	Set permissions:

	```shell
	sudo chmod 744 /etc/systemd/system/docker-event-listener.service
	```

	Reload daemon

	```shell
	sudo systemctl daemon-reload
	```

	Start Docker event listener

	```shell
	sudo systemctl start docker-event-listener.service
	```

	Status Docker event listener

	```shell
	sudo systemctl status docker-event-listener.service
	```

	Enable Docker event listener

	```shell
	sudo systemctl enable docker-event-listener.service
	```

6. Verify and deploy Zigbee2MQTT stack

	Now reconnect the serial adapter. Verify using the following command:

	```shell
	ls -al /dev/zigbee-serial
	```

	```shell
	lrwxrwxrwx 1 root root 7 Sep 28 21:14 /dev/zigbee-serial -> ttyACM0
	```

	Below an example of a `docker-stack-zigbee2mqtt.yml`:
	```yaml
	version: "3.7"
	services:
	  zigbee2mqtt:
		image: koenkk/zigbee2mqtt:latest-dev
		environment:
		  - TZ=Europe/Amsterdam
		volumes:
		  - /mnt/docker-cluster/zigbee2mqtt/data:/app/data
		  - /dev/zigbee-serial:/dev/zigbee-serial
		networks:
		  - proxy_traefik-net
		deploy:
		  placement:
			constraints: [node.hostname == rpi-3]
		  replicas: 1

	networks:
	  proxy_traefik-net:
		external: true
	```
	In the above example, `proxy_traefik-net` is the network to connect to the mqtt broker. The constraint makes sure Docker deploys only to this (`rpi-3`) node, where the serial adapter is connected to. The volume binding `/mnt/docker-cluster/zigbee2mqtt/data` is the zigbee2mqtt persistent directory, where `configuration.yaml` is saved.

	The zigbee2Zigbee2MQTTmqtt `configuration.yaml` should point to `/dev/zigbee-serial`:

	```yaml
	[...]
	serial:
	  port: /dev/zigbee-serial
	[...]
	```

	Deploy the stack:

	```shell
	docker stack deploy zigbee2mqtt --compose-file docker-stack-zigbee2mqtt.yml
	```

## Docker on Synology DSM 7.0

> **_NOTE:_** This may not work with all Zigbee controllers, but has been tested with the CC2531.

As of Disk Station Manager version 7, Synology removed the built-in support for USB-devices like a Zigbee controller.
The USB support can be installed to the Linux kernel by issuing the following commands as *root*.
````
modprobe usbserial
modprobe ftdi_sio
modprobe cdc-acm
````
After issuing the commands, the Zigbee controller may need to be unplugged and re-inserted to the USB port.

It is possible to create a start-up task that issues the above commands:
1. Create an executable script file that contains the three modprobe commands.
1. Using DSM's *Control Panel* -> *Task Scheduler* -> *Create* -> *Triggered Task* -> *User-defined script* with the settings: **User:** root, **Event:** Boot-up, and a `bash` command executing the executable file under *Task Settings*.

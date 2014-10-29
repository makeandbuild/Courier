Raspberry Pi Setup Instructions
===============================

Setup SD Card
------------
Download the following SD Formatter: https://www.sdcard.org/downloads/formatter_4/

Format the SD Card (Quick Format should work fine, if not use the Full format option).

Download NOOBS (Offline and network install): http://www.raspberrypi.org/downloads/

Copy the contents of the zip to the formatted SD Card and safely unmount the card once completed.

NOOBS Install
-------------
Plug in your keyboard, mouse, and monitor.

Now plug in the USB power cable to your Pi.

The Pi will boot up and you will see a window will appear with a operating systems that you can install. 

Select Raspbian and follow the instructions to complete install.

Configuration
-------------
`#` indicates a command run as root. `$` means run as a regular user. 

Login as user "pi" using the password set with the NOOBS installer. Become root with `$ sudo su -`

**Keyboard**

The Pi defaults to GB/UK keyboard layouts. If you notice your keymappings aren't correct, you can fix this in `/etc/default/keyboard` and change **XKBLAYOUT** to "us". Effect the change with `# setupcon`. This might take a minute. 

 
**WIFI**

We'll setup the Pi to connect to the office wifi with DHCP. Edit `/etc/wpa_supplicant/wpa_supplicant.conf` and add the following:

```
network={
  ssid="M&B"
  proto=WPA2
  key_mgmt=WPA-PSK
  pairwise=CCMP
  group=CCMP
  eap=TLS
  psk="20makenbuild13"
}
```

Reboot

`# reboot`


Verify you've connected to the network using `iwconfig`. 

**Update Packages**

```
# apt-get update
# apt-get upgrade -y
```

Raspbian mirrors are pretty slow... Go get some coffee, play prison yard ball, etc. 



**Bonjour/Zeroconf/Avahi**

We're all on DHCP on the office wireless, so using avahi can make it easier to connect by hostname instead of trying to look up IPs. 

```
# apt-get install libnss-mdns
```

You can modify the hostname by editing `/etc/hostname` and also `/etc/hosts`

**Bluetooth**

```
# apt-get install bluetooth bluez-utils libbluetooth-dev
```

**Python**

```
# apt-get install python-pip python-dev 
# pip install pybluez virtualenv virtualenvwrapper
```

Create a file in `/etc/profile.d/virtualenvwrapper.sh` and put this in it:

```
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```

**Create your user**

```
# adduser <yourfirstname>
```

**Add your user to sudoers**

```
# usermod -aG sudo <youruser>
```

(optional: make the sudo group work without a password. Use `visudo` and figure it out. You're smart, you can do it.)

**SSH**

(Accept defaults for ssh-keygen unless you're special)

```
# su - <youruser>
$ ssh-keygen -t rsa
```

Now you can add a key to Github. 

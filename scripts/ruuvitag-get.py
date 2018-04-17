import json
import urllib.request
import time
import uuid
from ruuvitag_sensor.ruuvitag import RuuviTag

# Beacon mac address
sensor = RuuviTag('D1:E1:97:8C:D0:AF')
# Unique identifier generated from hostname
uuid = uuid.uuid3(uuid.NAMESPACE_DNS, 'localhost')
# Table name for saving data
table = "RuuviTag"

# update state from the device
state = sensor.update()

# get latest state (does not get it from the device)
state = sensor.state

# double encode json
double_encode = json.dumps(state)

# generate json
serverUrl = 'https://node.example.com/insert/'
jsonData = {'deviceId': str(uuid),
    "tableName": table,
    "timestamp": int(time.time()),
    "data": double_encode
}

# insert request
params = json.dumps(jsonData).encode('utf8')
req = urllib.request.Request(serverUrl, data=params,
    headers={'content-type': 'application/json'})
response = urllib.request.urlopen(req)

# print output
print(response.read().decode('utf8'))


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
serverUrl = 'https://node.awareframework.com/insert/'
jsonData = {"deviceId": str(uuid),
    "tableName": table,
    "timestamp": int(time.time()),
    "data": double_encode
}

try:
    # insert request
    params = json.dumps(jsonData).encode('utf8')
    #print(params)
    req = urllib.request.Request(serverUrl, data=params,
        headers={'content-type': 'application/json'})
    response = urllib.request.urlopen(req)
    #print output
    resp_string = response.read().decode('utf8')
    print(resp_string)
    resp_json = json.loads(resp_string)
    #print(resp_json['success'])

    if str(resp_json['success']) is 'True':
        print('Succesfully inserted data')
    elif str(resp_json['success']) is 'False':
        print('Data insertion failed')
        raise ValueError('result false')
    else:
        print('wtf')
        raise ValueError('wtf error')

except:
    f = open('data.txt', 'a')
    f.write(str(json.dumps(jsonData)) + '\n' )
    print('data written to file')
    f.close

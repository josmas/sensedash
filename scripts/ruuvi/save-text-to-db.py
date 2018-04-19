import json
import urllib.request

serverUrl = 'https://node.awareframework.com/insert/'

with open('./data.txt') as f:
    for line in f:
        print(line)
        #params = json.dumps(line).encode('utf8')
        #print(params)
        #savedata = str(line)
        b = line.encode('utf-8')
        req = urllib.request.Request(serverUrl, data=b,
            headers={'content-type': 'application/json'})
        response = urllib.request.urlopen(req)
        print(response.read().decode('utf8'))

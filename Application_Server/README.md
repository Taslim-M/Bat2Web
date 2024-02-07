# Web Server with MQTT protocol connectivity 

## Tech Stack (WebApp)

We have elected to utilize the document-oriented MongoDB NoSQL database system for data management purposes. The interfacing with the database within the application server is facilitated through the use of the Mongoose library. This setup allows for efficient storage and retrieval of detection data, which is categorized according to three primary attributes: the geographic location of the detection (latitude and longitude coordinates); the timestamp of the detection (formatted according to the ISO 8601 standard); and the scientific name of the detected bat species. 

# Network Communication Flow

The LoRa Raspberry Pi Gateway serves as the middle-man during the communications, as it will receive the messages from the edge device over the LoRaWAN protocol, and forward them to The Things Network (TTN) broker. This gateway was configured to follow the relevant LoRa channel for our region (EU 863-870), and was registered in The Things Network web portal.


# If you find our study useful, please consider citing: 
```
@inproceedings{zualkernan2021aiot,
  title={An aiot system for bat species classification},
  author={Zualkernan, Imran and Judas, Jacky and Mahbub, Taslim and Bhagwagar, Azadan and Chand, Priyanka},
  booktitle={2020 IEEE International Conference on Internet of Things and Intelligence System (IoTaIS)},
  pages={155--160},
  year={2021},
  organization={IEEE}
}

```

# Classification and Behaviour Analysis of Bat Echolocation Calls using Supervised and Unsupervised Learning Algorithms

Bats play a pivotal role in maintaining ecological balance, with their study offering vital insights into environmental health and aiding conservation efforts. The complexity of bat calls, however, presents a significant challenge, necessitating expert analysis and extensive time for accurate interpretation. Addressing this, our study introduces neural network applications for analyzing bat call behavior and implementing a classification system. We employ unsupervised learning to generate clusters of bat calls, which are then examined through a novel framework to identify and quantify behavioral characteristics. For species classification, we develop a compact CNN model, achieving a notable F1-score of 0.9578 and an accuracy of 97.5\%. Furthermore, we present an open-source, end-to-end system that leverages the LoRaWAN protocol to facilitate real-time monitoring of bat populations via a web-based platform, enhancing accessibility and engagement in bat conservation efforts.

To understand the project, you can view this video on YouTube: [VIDEO](https://youtu.be/9pw_I2N22yo)

# Unsupervised Clustering
The unsupervised learning framework in our study is centered around the concept of generating clusters, with each cluster representing a distinct bat behavior. In selecting algorithms for this framework, we considered several factors: scalability, the underlying network architecture, the algorithm's category, and the implementation of common strategies such as over-clustering and pretext tasks.

Each clustering and pre-processing algorithm is hosted on its own GitHub, listed below:

| Algorithm | GitHub |
|----------|----------|
| Scripts for Preprocessing and other utility functions   | [code](https://github.com/arbab-ml/preprocessing_bats_clusters) |
| DeepCluster    | [code](https://github.com/arbab-ml/deepcluster) |
| JULE    | [code](https://github.com/arbab-ml/joint-cluster-cnn) |
| IMSAT    | [code](https://github.com/arbab-ml/Imsat-1) |
| IIC    | [code](https://github.com/arbab-ml/IIC-1) |
| SCAN    | [code](https://github.com/arbab-ml/SCAN-algorithm/tree/for_bats_dataset) |


# System Diagram

This system is characterized by the integration of edge devices, each outfitted with a microphone and an embedded computing unit for on-site deployment of a CNN model. Specifically, the system utilizes a high-fidelity 16-bit, 384 kHz analog-to-digital (A/D) Pettersson M500-384 USB Ultrasound microphone for audio signal acquisition.

<img src="/images/overall_new.png" width="800">

# Tech Stack (WebApp)

We have elected to utilize the document-oriented MongoDB NoSQL database system for data management purposes. The interfacing with the database within the application server is facilitated through the use of the Mongoose library. This setup allows for efficient storage and retrieval of detection data, which is categorized according to three primary attributes: the geographic location of the detection (latitude and longitude coordinates); the timestamp of the detection (formatted according to the ISO 8601 standard); and the scientific name of the detected bat species. 

![techstack](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/backend_stack.PNG)

# Network Communication Flow

The LoRa Raspberry Pi Gateway serves as the middle-man during the communications, as it will receive the messages from the edge device over the LoRaWAN protocol, and forward them to The Things Network (TTN) broker. This gateway was configured to follow the relevant LoRa channel for our region (EU 863-870), and was registered in The Things Network web portal.

![network](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/network.PNG)

# CNN (AI) Model
We developed a supervised Convolutional Neural Network (CNN) model specifically tailored for classifying bat species in edge devices. This model utilizes the Mel-scaled Filter Bank (MSFB) representation of audio segments. Emphasizing the need for deployment on edge devices, the model was meticulously designed to be compact. The original CNN model was constructed using the TensorFlow framework, and its architecture is depicted in Figure below.

![cnn](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/AI%20Model.PNG)

# Web Interface Images

The development of the website's front-end was accomplished using a combination of JavaScript, HTML, CSS, and Bootstrap 4, ensuring a design that is both responsive and mobile-friendly, as depicted in Figure \ref{webapp_overall}. The backend features an ExpressJS based web server.

![sample1](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/sample_mapview.PNG)

The web platform's homepage is characterized by a map interface, facilitated through the Google Maps API, which displays markers for each detection event. These markers are accompanied by a color-coded legend to aid in the visualization of data.

![sample2](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/sample_map_details.PNG)

The Dashboard section of the web application is designed to present a comprehensive summary of the bat detections.

![sample3](https://github.com/Taslim-M/ClassifyBatsAudio/blob/master/images/sample_dashboard.PNG)


# If you find our study useful, please consider citing: 
```
@article{,
  title={Classification and Behaviour Analysis of Bat Echolocation Calls using Supervised and Unsupervised Learning Algorithms.},
  author={},
  journal={},
  volume={},
  number={},
  pages={},
  year={},
  publisher={MDPI}
}
```



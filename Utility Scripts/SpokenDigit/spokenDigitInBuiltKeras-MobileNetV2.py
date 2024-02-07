import keras
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten, Convolution2D, MaxPooling2D
from keras.utils import np_utils
from matplotlib import pyplot as plt
import os

from collections import defaultdict
from PIL import Image

np.random.seed(123) # for testing

image_folder_path = r'C:\Users\azada\Documents\Uni Files\Non-Academic Uni Files\Dr. Imran Research Work\Data Sets\Spoken Digit Example\Spectros'


training_specs = []
testing_specs = []

training_labels = []
testing_labels = []


file_paths = [f for f in os.listdir(image_folder_path) if os.path.isfile(os.path.join(image_folder_path, f)) and '.png' in f]

for file_name in file_paths:
    spec_index = file_name.rsplit("_", 1)[1].rsplit(".", 1)[0]
    label = file_name[0]
    spectrogram = Image.open(image_folder_path + '/' + file_name)
    spectrogram = spectrogram.convert('RGB')
    spectrogram = spectrogram.resize((224,224))
    spectrogram = np.array(spectrogram)
    if int(spec_index) <= 4:
        testing_specs.append(spectrogram)
        testing_labels.append(label)
    else:
        training_specs.append(spectrogram)
        training_labels.append(label)

training_specs = np.array(training_specs)
testing_specs = np.array(testing_specs)
training_labels = np.array(training_labels)
testing_labels = np.array(testing_labels)


training_specs = training_specs.astype('float32') # convert types to float
testing_specs = testing_specs.astype('float32')
training_specs /= 255 # normalize data to a 0-1 value
testing_specs /= 255


training_labels = np_utils.to_categorical(training_labels, 10) # convert data to categories
testing_labels = np_utils.to_categorical(testing_labels, 10)


model = keras.applications.mobilenet_v2.MobileNetV2(input_shape=None, alpha=1.0, include_top=True, weights=None, input_tensor=None, pooling=None, classes=10)



#Compile the model
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])

#Train the model
model.fit(training_specs, training_labels, 
          batch_size=32, nb_epoch=4, verbose=1)

#Test the results
score = model.evaluate(testing_specs, testing_labels, verbose=0)

print(score)

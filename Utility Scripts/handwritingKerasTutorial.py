import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten, Convolution2D, MaxPooling2D
from keras.utils import np_utils
from keras.datasets import mnist
from matplotlib import pyplot as plt


np.random.seed(123) # for testing

(X_train, y_train), (X_test, y_test)= mnist.load_data() # load training and testing data
print(X_train.shape)
plt.imshow(X_train[0])

#Here ".shape[0]" is literally just a quick way to get 60k or 10k
X_train = X_train.reshape(X_train.shape[0], 28, 28, 1)
X_test = X_test.reshape(X_test.shape[0], 28, 28, 1)
#print(X_train.shape)

X_train = X_train.astype('float32') # convert types to float
X_test = X_test.astype('float32')
X_train /= 255 # normalize data to a 0-1 value
X_test /= 255


Y_train = np_utils.to_categorical(y_train, 10) # convert data to categories
Y_test = np_utils.to_categorical(y_test, 10)

#Make the CNN model
model = Sequential()
model.add(Convolution2D(32, (3, 3), activation='relu', input_shape=(28,28, 1)))
print(model.output_shape)

model.add(Convolution2D(32, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.25))


model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(10, activation='softmax'))

#Compile the model
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['mse', 'accuracy'])

#Train the model
history = model.fit(X_train, Y_train, 
          batch_size=32, nb_epoch=2, verbose=1)

plt.plot(history.history['mse'])


#Test the results
score = model.evaluate(X_test, Y_test, verbose=0)

print(score)











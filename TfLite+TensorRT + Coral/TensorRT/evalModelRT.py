import numpy as np
from tensorflow.keras.preprocessing import image

img_path = './testIMG.png'  
img = image.load_img(img_path, target_size=(112, 170))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)

print(type(x))
print((x.shape))



import tensorflow as tf


input_saved_model = 'mel_collab'

"""Runs prediction on a single image and shows the result.
input_saved_model (string): Name of the input model stored in the current dir
"""

x = tf.constant(x)

saved_model_loaded = tf.saved_model.load(input_saved_model)
signature_keys = list(saved_model_loaded.signatures.keys())
print(signature_keys)

infer = saved_model_loaded.signatures['serving_default']
print(infer.structured_outputs)

#this  calls model
labeling = infer(x)
preds = labeling['output'].numpy()
print(preds)


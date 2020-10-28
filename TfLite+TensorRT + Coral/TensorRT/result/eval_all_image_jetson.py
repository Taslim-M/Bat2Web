import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

def getSpeciesCode(x):
    part = x.split('_')
    if part[0] == 'ASETRI':
        return 0
    elif part[0] == 'EPTBOT':
        return 1
    elif part[0] == 'MYOEMA':
        return 2
    elif part[0] == 'PIPKUH':
        return 3
    elif part[0] == 'RHIMUS':
        return 4
    elif part[0] == 'RHYNAS':
        return 5
    elif part[0] == 'ROUAEG':
        return 6
    elif part[0] == 'TAPPER':
        return 7
    else:
        return 'Unknown'
    


#Load Model
input_saved_model = 'mel_collab'
saved_model_loaded = tf.saved_model.load(input_saved_model)
signature_keys = list(saved_model_loaded.signatures.keys())
print(signature_keys)

infer = saved_model_loaded.signatures['serving_default']
print(infer.structured_outputs)

# Evaluate for each Image
image_folder_path = './SpectogramInitial'
file_paths = [f for f in os.listdir(image_folder_path)]

Y_pred = []
Y_actual =[]
print('Total images : ' , len(file_paths))
count =0
for file_name in file_paths:
	img_path =os.path.join(image_folder_path, file_name)
	img = image.load_img(img_path, target_size=(112,170))
	x = image.img_to_array(img)
	x = x / 255
	x = np.expand_dims(x, axis=0)
	x = tf.constant(x)
	Y_actual.append(getSpeciesCode(file_name))
	
	#this  calls model
	labeling = infer(x)
	preds = labeling['output'].numpy()
	Y_pred.append(np.argmax(preds))
	count+=1
	if(count % 100 ==1): print('done with: ',count)
	
print('Done with', count)

y_pred = np.array(Y_pred)
y_actual = np.array(Y_actual)
print('ypredict-array-shape', y_pred.shape)
print('yactual-array-shape', y_actual.shape)
np.save(r"result/y_pred_jetson",y_pred)
np.save(r"result/y_actual_jetson",y_actual)


import pyaudio
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
import time
import tensorflow as tf

#AI MODEL
input_saved_model = 'mel_collab'
saved_model_loaded = tf.saved_model.load(input_saved_model)
signature_keys = list(saved_model_loaded.signatures.keys())
print(signature_keys)

infer = saved_model_loaded.signatures['serving_default']
print(infer.structured_outputs)
print('preparing mic')
p = pyaudio.PyAudio()
for ii in range(p.get_device_count()):
    print(p.get_device_info_by_index(ii).get('name'))
    if p.get_device_info_by_index(ii).get('name') == 'iRig Mic Cast HD: USB Audio (hw:2,0)':
        index = ii
print('Mic found at',index)


def preprocess(final_arr, start_time, fig):
    #PreProcess
    spec = librosa.feature.melspectrogram(y=final_arr, sr=sr, n_fft = int(window_width*sr), hop_length =int(sliding*sr), fmax=sr/2)
    #Convert amplitude to decibels
    db_spec = librosa.power_to_db(spec, ref=np.max)
    ax = plt.axes()
    librosa.display.specshow(db_spec, sr=sr, hop_length =int(sliding*sr),fmax=sr/2)
    ax.axis('off')
    fig.tight_layout(pad=0)
    ax.margins(0)
    fig.canvas.draw()
    image_from_plot = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
    image_from_plot = image_from_plot.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    image_from_plot = np.float32(image_from_plot) #For Model Compatibility
    image_from_plot = np.expand_dims(image_from_plot, axis=0)
    image_from_plot = tf.constant(image_from_plot)
    plt.clf()

    #Record total preprocessing time
    pre_proc_time.append(time.time() - start) 
    #End PreProcess
    
	#Call TF  Model
    start_eval = time.time()
    labeling = infer(image_from_plot)
    preds = labeling['output'].numpy()
    #Record model inference time
    infer_time.append(time.time() - start_eval)
	
#MIC SETTINGS
form_1 = pyaudio.paInt16 # 24-bit resolution but using 16
chans = 1 # 1 channel
samp_rate = 44100 # 44.1kHz sampling rate
chunk = 4096 # 2^12 samples for buffer
record_secs = 3 # seconds to record
dev_index = index # device index found by p.get_device_info_by_index(ii)

# MEL CONFIGS
window_width =  0.025 #25 ms  window size 
sliding = 0.01 #10ms stride 
sr = samp_rate

fig = plt.figure(figsize=(1.70, 1.12), dpi=100)

pre_proc_time = [] #Record prepreoccsing times
infer_time = [] #Record infer times

#Main Test Loop
audio = pyaudio.PyAudio() # create pyaudio instantiation
print('Starting Main Loop')
# create pyaudio stream
stream = audio.open(format = form_1,rate = samp_rate,
                    channels = chans, 
                    input_device_index = dev_index,
                    input = True,
                    frames_per_buffer=chunk)
#Repeat for 10 minutes (200 samples 3*200 = 6000 seconds)
for iteration in range(200):
    frames = []

    # loop through stream and append audio chunks to frame array
    for ii in range(0,int((samp_rate/chunk)*record_secs)):
        data = stream.read(chunk,exception_on_overflow = False)
        frames.append(np.fromstring(data,dtype=np.float16))
    #Begin pre_processing
    start = time.time()
    final_arr = np.array(frames).ravel()
    np.nan_to_num(final_arr,copy=False)
    preprocess(final_arr, start, fig)
# stop the stream, close it, and terminate the pyaudio instantiation
stream.stop_stream()
stream.close()
audio.terminate()


d = pre_proc_time.pop(0)
ppt = np.array(pre_proc_time)
print('mean preprocessing time',ppt.mean())
print('std',ppt.std())

d = infer_time.pop(0)
it = np.array(infer_time)
print('mean inferance time',it.mean())
print('std',it.std())

total_time = it+ ppt

print('mean total time',total_time.mean())
print('std',total_time.std())

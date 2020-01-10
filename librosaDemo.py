import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

#Change sr to your sampling rate
data, sr = librosa.load(r'your-audio-path-here', sr = 8000)
print(data.shape)
print(sr)

#basic waveplot of audio
librosa.display.waveplot(data, sr=sr)


#Make a mel spectrogram from audio
spec = librosa.feature.melspectrogram(y=data, sr=sr)
#Convert amplitude to decibels
db_spec = librosa.power_to_db(spec, ref=np.max)

#Prepare to save to file
fig = plt.figure()

##Can resize image to your chosen smaller 'pixelWidth' and 'pixelHeight'
#fig.set_size_inches((pixelWidth/fig.get_dpi(), pixelHeight/fig.get_dpi()))


#Display final mel spectrogram
librosa.display.specshow(db_spec, sr=sr)

##For GRAYSCALE output, use this instead
#librosa.display.specshow(db_spec, sr=sr, cmap='gray_r')


##Add color legend on the side (commented out because DL training doesn't need this)
#plt.colorbar()

#Save spectrogram to file
fig.savefig(r'your-image-path-here')

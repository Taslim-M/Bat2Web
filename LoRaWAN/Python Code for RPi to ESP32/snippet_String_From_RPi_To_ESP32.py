import serial
import time


ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
ser.flush()

ser.write(b"Message From RPI\n")

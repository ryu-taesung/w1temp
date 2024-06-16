#!/usr/bin/env python
import os
import glob
import time
import sqlite3 
 
#os.system('modprobe w1-gpio')
#os.system('modprobe w1-therm')
 
db = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'w1temps.db'), timeout=9000) 
 
base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'
 
def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines
 
def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return round(temp_f, 1)
    
localtime = time.asctime(time.localtime(time.time()))
w1temp = read_temp()


cursor = db.cursor()
cursor.execute('''
	CREATE TABLE IF NOT EXISTS w1temps(id INTEGER PRIMARY KEY, time_stamp TIMESTAMP default current_timestamp,
						w1temp REAL)
''')
db.commit()

cursor.execute('''INSERT INTO w1temps(w1temp)
					VALUES(:w1temp)''',
					{'w1temp':w1temp})

db.commit()
db.close()

#print(w1temp)


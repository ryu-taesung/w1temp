#!/usr/bin/env python

import sqlite3
import os

db = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'w1temps_archive.db'), timeout=9000)
cursor = db.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS w1temps \
                (id INTEGER PRIMARY KEY, \
                time_stamp NUMERIC, \
                w1temp REAL);")
cursor.execute(f"ATTACH DATABASE '{os.path.join(os.path.dirname(__file__),'w1temps.db')}' AS Z")
cursor.execute("INSERT INTO w1temps (id, time_stamp, w1temp) SELECT * FROM z.w1temps WHERE id NOT IN (SELECT id FROM w1temps)")
cursor.execute("DELETE FROM Z.w1temps WHERE datetime(Z.w1temps.time_stamp) <= datetime('now', '-7 days')")
db.commit()
db.execute("VACUUM")
db.close()

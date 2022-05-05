from distutils.log import debug
from mido import MidiFile
from sympy import content, true
import json

mid = MidiFile('data/summer.midi', clip=True)
print(mid)
mididict = []
output = []

for i in mid:
    if i.type == 'note_on' or i.type == 'note_off' or i.type == 'time_signature':
        mididict.append(i.dict())

elapseTime = 0
for i in mididict:
    endtime = i['time'] + elapseTime
    elapseTime = endtime

    if i['type'] == 'note_on' and i['velocity'] == 0:
        i['type'] = 'note_off'

    if i['type'] == 'note_on' or i['type'] == 'note_off':
        info = {"type": i['type'], "note": i['note'], "time": i['time'], "endtime": endtime, "channel": i['channel']}
        output.append(info)

    if i['type'] == 'time_signature':
        info = {"type": i['type'], "numerator": i['numerator'], "denominator": i['denominator'], "time": i['time'], "endtime": endtime}
        output.append(info)

# viewing the midimessages.
# for i in output:
#     print(i)

# print(mid.ticks_per_beat)

with open("data/midi.json", "w") as f:
  content = json.dumps(output)
  f.write(content)
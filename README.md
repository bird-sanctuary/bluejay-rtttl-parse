# Bluejay RTTTL Parse [![codecov](https://img.shields.io/codecov/c/github/saidinesh5/bluejay-rtttl-parse.svg)](https://codecov.io/gh/saidinesh5/bluejay-rtttl-parse)
A JavaScript library for Nokia Ring Tone Text Transfer Language (RTTTL) <-> Bluejay ESC startup tunes conversions

# About
This library allows conversion between RTTTL strings and Bluejay Startup Melody datastructure - which can played on ESCs with Bluejay firmware.

Bluejay Startup Melody is a bytearray of default length 128, and has a structure like:

| [bpm]   | [default octave] | [default duration]  | [62 (Temp4, Temp3) values] |
| ------- | :--------------: | :-----------------: | :------------------------: |
| 2 bytes |      1 byte      |       1 byte        |   124 bytes                |


In general,
* The first 4 bytes of the byte array are considered metadata and are ignored by the parer in the ESC firmware.
* Temp3 is the pulse duration - a measure of the frequency of the note
* Temp4 is the number of pulses - a measure of the duration of the note

If you just want to play some RTTTL files online, use the demo player: [rtttl-play](https://adamonsoon.github.io/rtttl-play/)

# Usage
```javascript
> Rtttl.parse('Back to the Future:d=16,o=5,b=200:4g.,p,4c.,p,2f#.,p,g.,p,a.,p,8g,p,8e,p,8c,p,4f#,p,g.,p,a.,p,8g.,p,8d.,p,8g.,p,8d.6,p,4d.6,p,4c#6,p,b.,p,c#.6,p,2d.6');
{ name: 'Back to the Future',
  defaults: { duration: '16', octave: '5', bpm: '200' },
  melody: 
   [ { duration: 450, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 450, frequency: 523.3 },
     { duration: 75, frequency: 0 },
     { duration: 900, frequency: 740 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 880 },
     { duration: 75, frequency: 0 },
     { duration: 150, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 150, frequency: 659.3 },
     { duration: 75, frequency: 0 },
     { duration: 150, frequency: 523.3 },
     { duration: 75, frequency: 0 },
     { duration: 300, frequency: 740 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 880 },
     { duration: 75, frequency: 0 },
     { duration: 225, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 225, frequency: 587.3 },
     { duration: 75, frequency: 0 },
     { duration: 225, frequency: 784 },
     { duration: 75, frequency: 0 },
     { duration: 225, frequency: 587.3 },
     { duration: 75, frequency: 0 },
     { duration: 450, frequency: 587.3 },
     { duration: 75, frequency: 0 },
     { duration: 300, frequency: 1108.7 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 987.8 },
     { duration: 75, frequency: 0 },
     { duration: 112.5, frequency: 554.4 },
     { duration: 75, frequency: 0 },
     { duration: 900, frequency: 587.3 } ] }

> Rtttl.toBluejayStartupMelody('Back to the Future:d=16,o=5,b=200:4g.,p,4c.,p,2f#.,p,g.,p,a.,p,8g,p,8e,p,8c,p,4f#,p,g.,p,a.,p,8g.,p,8d.,p,8g.,p,8d.6,p,4d.6,p,4c#6,p,b.,p,c#.6,p,2d.6')
{
  data: Uint8Array(128) [
      0, 200,   5, 16, 255, 35,  98, 35,  75,  0, 235, 61,
     75,   0, 255, 39, 255, 39, 156, 39,  75,  0,  88, 35,
     75,   0,  99, 30,  75,  0, 118, 35,  75,  0,  99, 45,
     75,   0,  78, 61,  75,  0, 222, 39,  75,  0,  88, 35,
     75,   0,  99, 30,  75,  0, 176, 35,  75,  0, 132, 53,
     75,   0, 176, 35,  75,  0, 255, 18,   9, 18,  75,  0,
    255,  18, 255, 18,  19, 18,  75,  0, 255, 20,  78, 20,
     75,   0, 111, 25,  75,  0, 125, 20,  75,  0, 255, 18,
    255,  18, 255, 18,
    ... 28 more items
  ],
  errorCodes: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0
  ]
}

> Rtttl.fromBluejayStartupMelody(Rtttl.toBluejayStartupMelody('Back to the Future:d=16,o=5,b=200:4g.,p,4c.,p,2f#.,p,g.,p,a.,p,8g,p,8e,p,8c,p,4f#,p,g.,p,a.,p,8g.,p,8d.,p,8g.,p,8d.6,p,4d.6,p,4c#6,p,b.,p,c#.6,p,2d.6').data)
Melody:b=200,o=5,b=16:4g.,p,4c.,p,2f#.,p,16g.,p,16a.,p,8g,p,8e,p,8c,p,4f#,p,16g.,p,16a.,p,8g.,p,8d.,p,8g.,p,8d6.,p,4d6.,p,4c#6,p,16b.,p,16c#6.,p,2d6.
```

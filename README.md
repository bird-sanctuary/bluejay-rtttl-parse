# Bluejay RTTTL Parse
A JavaScript library for Nokia Ring Tone Text Transfer Language (RTTTL) <-> Bluejay ESC startup tunes conversions
[![travis build](https://travis-ci.org/adamonsoon/rtttl-parse.svg?branch=master)](https://travis-ci.org/adamonsoon/rtttl-parse)
[![codecov](https://img.shields.io/codecov/c/github/adamonsoon/rtttl-parse.svg)](https://codecov.io/gh/adamonsoon/rtttl-parse)

# About
This library allows conversion between RTTTL strings and Bluejay Startup Melody datastructure - which can played on ESCs with Bluejay firmware.

Bluejay Startup Melody is a bytearray of default length 128, of structure:

```
 [[2 bytes of bpm],[1 byte of default octave],[1 byte of default duration][62 (Temp4, Temp3) values]]
```

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
> 
```

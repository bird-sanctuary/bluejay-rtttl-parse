import { expect } from 'chai';
import sinon from 'sinon';
import rtttlParse from './index.js';

describe('parse', () => {

  const rtttl="A-Team:d=8,o=5,b=125:4d#6,a#,2d#6,16p,g#,4a#,4d#.,p,16g,16a#,d#6,a#,f6,2d#6,16p,c#.6,16c6,16a#,g#.,2a#";

  it('should return an object', () => {
    expect(rtttlParse.parse(rtttl)).to.be.an('object');
  });

  it('should have 3 keys', () => {
    expect(rtttlParse.parse(rtttl)).to.contain.all.keys(['name', 'defaults', 'melody']);
  });

  it('all keys should be defined', () => {
    expect(rtttlParse.parse(rtttl).name).to.be.a('string');
    expect(rtttlParse.parse(rtttl).defaults).to.be.an('object');
    expect(rtttlParse.parse(rtttl).melody).to.be.an('array');
  });

  it('should throw an error if no rtttl string is provided', () => {
    expect(() => rtttlParse.parse('')).to.throw(Error).with.property('message', 'Invalid RTTTL file.');
  });

  it('should throw an error if rtttl file contains less than 3 parts', () => {
    expect(() => rtttlParse.parse('A-Team:d=8,o=5,b=125')).to.throw(Error).with.property('message', 'Invalid RTTTL file.');
  });

});

describe('getName', () => {

  beforeEach(function(){
    this.cStubWarn = sinon.stub(console, "warn");
  });

  afterEach(function(){
    this.cStubWarn.restore();
  });

  it('should return the same value', () => {
    expect(rtttlParse.getName('hello')).to.equal('hello');
  });

  it('should return Unknown if the value is empty', () => {
    expect(rtttlParse.getName('')).to.equal('Unknown');
  });

  it('should warn if the value is longer than 10 charachters', () => {
    rtttlParse.getName('0123456789A')
    expect(console.warn.calledWith('Tune name should not exceed 10 characters.')).to.be.true;
  });

});

describe('getDefaults', () => {

  beforeEach(function(){
    this.cStubWarn = sinon.stub(console, "warn");
  });

  afterEach(function(){
    this.cStubWarn.restore();
  });

  it('should return an object', () => {
    expect(rtttlParse.getDefaults('d=16,o=6,b=140')).to.be.an('object');
  });

  it('should have 3 keys', () => {
    expect(rtttlParse.getDefaults('d=16,o=6,b=140')).to.contain.all.keys(['duration', 'octave', 'bpm']);
  });

  it('should return specified duration', () => {
    expect(rtttlParse.getDefaults('d=32')).to.have.property('duration').and.equal('32');
  });

  it('should return specified octave', () => {
    expect(rtttlParse.getDefaults('o=4')).to.have.property('octave').and.equal('4');
  });

  it('should return specified bpm', () => {
    expect(rtttlParse.getDefaults('b=250')).to.have.property('bpm').and.equal('250');
  });

  it('should return default duration if not specified', () => {
    expect(rtttlParse.getDefaults('o=6,b=140')).to.have.property('duration').and.equal('4');
  });

  it('should return default octave if not specified', () => {
    expect(rtttlParse.getDefaults('d=16,b=140')).to.have.property('octave').and.equal('6');
  });

  it('should return default bpm if not specified', () => {
    expect(rtttlParse.getDefaults('d=16,o=6')).to.have.property('bpm').and.equal('63');
  });

  it('should return default values if nothing is specified', () => {
    expect(rtttlParse.getDefaults('')).to.have.property('bpm').and.equal('63');
    expect(rtttlParse.getDefaults('')).to.have.property('octave').and.equal('6');
    expect(rtttlParse.getDefaults('')).to.have.property('duration').and.equal('4');
  });

  it('should throw an error if duration is invalid', () => {
    expect(() => rtttlParse.getDefaults('d=17')).to.throw(Error).with.property('message', 'Invalid duration 17');
  });

  it('should throw an error if a setting does not contain = separator', () => {
    expect(() => rtttlParse.getDefaults('d')).to.throw(Error).with.property('message', 'Invalid setting d');
  });

  it('should warn if the octave value is invalid', () => {
    rtttlParse.getDefaults('o=17');
    expect(console.warn.calledWith('Invalid octave 17')).to.be.true;
  });

  it('should warn if the bpm value is invalid', () => {
    rtttlParse.getDefaults('b=10000');
    expect(console.warn.calledWith('Invalid BPM 10000')).to.be.true;
  });

});

describe('getData', () => {

  const rtttlMelody = 'c,8d,1g.,8d,d,2d,8d#,8d#,2d';
  const defaults = {
    duration: '4',
    octave: '4',
    bpm: '120'
  };

  it('should be an array', () => {
    expect(rtttlParse.getData(rtttlMelody, defaults)).to.be.an('array');
  });

  it('should have note name, duration and frequency set for each note', () => {

    rtttlParse.getData(rtttlMelody, defaults).map((item) => {
      expect(item).to.contain.all.keys('note', 'duration', 'frequency');
    });

    rtttlParse.getData(rtttlMelody, defaults).map((item) => {
      expect(item.frequency).to.to.be.a('number');
      expect(item.duration).to.be.a('number');
    });

  });

  it('should return correct note values', () => {
    expect(rtttlParse.getData('a',  defaults)[0].note).to.equal('a');
    expect(rtttlParse.getData('a#', defaults)[0].note).to.equal('a#');
    expect(rtttlParse.getData('b',  defaults)[0].note).to.equal('b');
    expect(rtttlParse.getData('h',  defaults)[0].note).to.equal('b');
    expect(rtttlParse.getData('c',  defaults)[0].note).to.equal('c');
    expect(rtttlParse.getData('c#', defaults)[0].note).to.equal('c#');
    expect(rtttlParse.getData('d',  defaults)[0].note).to.equal('d');
    expect(rtttlParse.getData('d#', defaults)[0].note).to.equal('d#');
    expect(rtttlParse.getData('e',  defaults)[0].note).to.equal('e');
    expect(rtttlParse.getData('e#', defaults)[0].note).to.equal('e#');
    expect(rtttlParse.getData('f',  defaults)[0].note).to.equal('f');
    expect(rtttlParse.getData('f#', defaults)[0].note).to.equal('f#');
    expect(rtttlParse.getData('g',  defaults)[0].note).to.equal('g');
    expect(rtttlParse.getData('g#', defaults)[0].note).to.equal('g#');
  });

  it('should return correct frequency values', () => {
    expect(rtttlParse.getData('a',  defaults)[0].frequency).to.be.closeTo(440, 0.1);
    expect(rtttlParse.getData('a4', defaults)[0].frequency).to.be.closeTo(440, 0.1);
    expect(rtttlParse.getData('a5', defaults)[0].frequency).to.be.closeTo(880, 0.1);
    expect(rtttlParse.getData('a6', defaults)[0].frequency).to.be.closeTo(1760, 0.1);
    expect(rtttlParse.getData('a7', defaults)[0].frequency).to.be.closeTo(3520, 0.1);
    expect(rtttlParse.getData('c',  defaults)[0].frequency).to.be.closeTo(261.6, 0.1);
    expect(rtttlParse.getData('c4', defaults)[0].frequency).to.be.closeTo(261.6, 0.1);
    expect(rtttlParse.getData('c5', defaults)[0].frequency).to.be.closeTo(523.2, 0.1);
    expect(rtttlParse.getData('c6', defaults)[0].frequency).to.be.closeTo(1046.5, 0.1);
    expect(rtttlParse.getData('c7', defaults)[0].frequency).to.be.closeTo(2093, 0.1);
    expect(rtttlParse.getData('c.7', defaults)[0].frequency).to.be.closeTo(2093, 0.1);
  });

  it('should return correct duration values', () => {
    expect(rtttlParse.getData('1a', defaults)[0].duration).to.equal(2000);
    expect(rtttlParse.getData('1a.', defaults)[0].duration).to.equal(3000);
    expect(rtttlParse.getData('2a', defaults)[0].duration).to.equal(1000);
    expect(rtttlParse.getData('2a.', defaults)[0].duration).to.equal(1500);
    expect(rtttlParse.getData('4a', defaults)[0].duration).to.equal(500);
    expect(rtttlParse.getData('4a.', defaults)[0].duration).to.equal(750);
    expect(rtttlParse.getData('8a', defaults)[0].duration).to.equal(250);
    expect(rtttlParse.getData('8a.', defaults)[0].duration).to.equal(375);
    expect(rtttlParse.getData('16a', defaults)[0].duration).to.equal(125);
    expect(rtttlParse.getData('16a.', defaults)[0].duration).to.equal(187.5);
    expect(rtttlParse.getData('32a', defaults)[0].duration).to.equal(62.5);
    expect(rtttlParse.getData('32a.', defaults)[0].duration).to.equal(62.5*1.5);
    expect(rtttlParse.getData('32a..', defaults)[0].duration).to.equal(62.5*1.75);
    expect(rtttlParse.getData('32a...', defaults)[0].duration).to.equal(62.5*1.875);
    expect(rtttlParse.getData('32a....', defaults)[0].duration).to.equal(62.5*1.9375);
    expect(rtttlParse.getData('32a.#', defaults)[0].duration).to.equal(62.5*1.5);
    expect(rtttlParse.getData('32a..#', defaults)[0].duration).to.equal(62.5*1.75);
    expect(rtttlParse.getData('32a...#', defaults)[0].duration).to.equal(62.5*1.875);
    expect(rtttlParse.getData('32a....#', defaults)[0].duration).to.equal(62.5*1.9375);
    expect(rtttlParse.getData('32a#.', defaults)[0].duration).to.equal(62.5*1.5);
    expect(rtttlParse.getData('32a#..', defaults)[0].duration).to.equal(62.5*1.75);
    expect(rtttlParse.getData('32a#...', defaults)[0].duration).to.equal(62.5*1.875);
    expect(rtttlParse.getData('32a#....', defaults)[0].duration).to.equal(62.5*1.9375);
  });

  it('should treat b and h as the same note', () => {
    expect(rtttlParse.getData('b',  defaults)[0].frequency).to.be.closeTo(493.9, 0.1);
    expect(rtttlParse.getData('h',  defaults)[0].frequency).to.be.closeTo(493.9, 0.1);
  });

});

describe('toBluejayStartupMelody', () => {

  const rtttl="A-Team:d=8,o=5,b=125:4d#6,a#,2d#6,16p,g#,4a#,4d#.,p,16g,16a#,d#6,a#,f6,2d#6,16p,c#.6,16c6,16a#,g#.,2a#";

  it('should return an object with startupMelody and errorCodes as members', () => {
    const startupMelodyLength = 64;
    let result = rtttlParse.toBluejayStartupMelody(rtttl, startupMelodyLength);
    expect(result).to.be.an('object');
    expect(result.data).to.be.an('Uint8Array');
    expect(result.data.length).to.equal(startupMelodyLength);
    expect(result.data[1]).to.equal(125);
    expect(result.data[2]).to.equal(5);
    expect(result.data[3]).to.equal(8);
    expect(result.data.reduce((result, value) => result && value < 2**8, true)).to.equal(true);
    expect(result.errorCodes).to.be.an('Array');
  });

  it('should return an object with startupMelody of default length 128 when startupMelodyLength is not specified', () => {
    expect(rtttlParse.toBluejayStartupMelody(rtttl).data.length).to.equal(128);
  });
  
  it('should throw an error with startupMelody length is less than 4', () => {
    let errorThrown = false;
    try {
      rtttlParse.toBluejayStartupMelody(rtttl, 2);
    } catch (e) {
        errorThrown = true;
    }
    expect(errorThrown).to.equal(true);
  });

  it('should fail to convert a note that doesnt fit in Temp3', () => {
    expect(rtttlParse.toBluejayStartupMelody("Melody:d=8,o=2,b=125:c").errorCodes[0]).to.equal(1);
  });

  it('should fail to convert a melody that wont fit in startupMelodyLength', () => {
    const result = rtttlParse.toBluejayStartupMelody("Melody:d=8,o=4,b=900:c,d", 6);
    expect(result.errorCodes[0]).to.equal(0);
    expect(result.errorCodes[1]).to.equal(2);

    const result2 = rtttlParse.toBluejayStartupMelody("Melody:d=8,o=4,b=900:p,p", 6);
    expect(result2.errorCodes[0]).to.equal(0);
    expect(result2.errorCodes[1]).to.equal(2);
  });

});

describe('fromBluejayStartupMelody', () => {

  it('should return an object with startupMelody and errorCodes as members', () => {
    let melodies = [
        "a:d=4,o=5,b=40:16g3.,32g3.,32g3.,16g3.,32f#.,32g.,32g.,16a3.,32g#.,32g#.,32a.,32a.,16g.,32g.,32g.,32g.,32g.,32f#.,32d#4.,32g.,32g.,16c4.,32a3.,8p.,32g.,32g.,32g3.,32g3.,32g3.,32f#.,32g.,32g.,32g.,16a4.,32b.,32b.,32a.,32a3.,32g.,32g.,16g.,32g.,32g.,16a.,32g.",
        "b:d=4,o=5,b=40:16g.,32g.,32g.,16d.,32a3.,32b3.,32b3.,16a.,32b.,32b.,32c4.,32c4.,16e.,32c.,32d6.,32b.,32d4.,32d4.,32f#.,32e4.,32d4.,16e.,32d.,8p.,32g4.,32g4.,32g.,32g.,32g.,32a3.,32a.,32b3.,32e4.,16e.,32g#4.,32g#4.,32c.,32c.,32b4.,32c.,16d.,32b.,32d4.,16f#.,32e4.",
        "c:d=4,o=5,b=40:16g4.,32d.6,32b.,16g.,32a.,32d.,32d.,16e.,32b3.,32b3.,32e.,32e.,16e4.,32c4.,32b3.,32c4.,32b.,32c.,32a.,32b.4,32b.4,16c.,32f#4.,8p.,32b3.,32a3.,32b4.,32b.,32b.,32a.,32b3.,32d.,32b4.,16c6.,32e.,32e.,32e.,32a.,32c4.,32c4.,16d6.,32c4.,32b.,16c.",
        "d:d=4,o=5,b=40:16g4.,32b.4,32d.,16b.,32d.,32d.,32d.,16c6.,32d.,32d.,32e.,32e.,16c.,32e.,32d.,32d.,32d.,32a.,32c.,32e.,32e.,16g4.,32a4.,8p.,32d.,32d.,32d6.,32d.,32d.,32d.,32d.,32d.,32e.,16c6.,32d.,32d.,32a4.,32e.,32e.,32e.,16b3.,32d.,32d.,16d#4.,32e.",
        "Melody:b=112,o=5,d=4:32c,8d.,16f.,16p.,8f,32d,16e.,8d,8c,8a4,8d.,16g.,16p.,8g"
    ];
    for (var rtttl of melodies) {
        let startupMelody = rtttlParse.toBluejayStartupMelody(rtttl);
        let result = rtttlParse.fromBluejayStartupMelody(startupMelody.data);
        expect(result).to.be.an('string');
        expect(result.split(':')[2].length).to.equal(rtttl.split(':')[2].length);
    }
  });

  it('should store the correct metadata', () => {
    let rtttl = "Melody:b=112,o=5,d=4:32c,8d.,16f.,16p.,8f,32d,16e.,8d,8c,8a4,8d.,16g.,16p.,8g";
    let result = rtttlParse.toBluejayStartupMelody(rtttl).data;
    expect(result[0]).to.equal(0);
    expect(result[1]).to.equal(112);
    expect(result[2]).to.equal(5);
    expect(result[3]).to.equal(4);
  });

  it('should return correct number of dotted notes', () => {
    const ALLOWED_BPM = [
      '25', '28', '31', '35', '40', '45', '50', '56', '63', '70', '80', '90', '100',
      '112', '125', '140', '160', '180', '200', '225', '250', '285', '320', '355',
      '400', '450', '500', '565', '635', '715', '800', '900'
    ];

    for (var bpm of ALLOWED_BPM) {
      for (var o of [4, 5, 6, 7]) {
        for (var d of [1, 2, 4, 8, 16, 32]) {
          for (var s of ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'p']) {
            for (var dots of ['', '.']) {
              const rtttl = "Melody:b=" + bpm + ",o=" + o + ",d=" + d + ":" + s + dots;
              const startupMelody = rtttlParse.toBluejayStartupMelody(rtttl);
              if (startupMelody.errorCodes.every((v) => v === 0)) {
                expect(rtttlParse.fromBluejayStartupMelody(startupMelody.data)).to.equal(rtttl);
              }
            }
          }
        }
      }
    }
  });

});

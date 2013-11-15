MIDI file format
================

Outline
-------

File header :

	00-03 : 4d 54 68 64 =  77  84 104 100 (MThd) 
	04-07 : 00 00 00 06 =   0   0   0   6 (length of the header : the 3 following words) 
	08-09 : 00 01       =   0   1 (format : 0 means 1 track, 1 means simultaneous tracks, 2 means async tracks)
	0a-0b : 00 01       =   0   1 (number of tracks)
	0c-0d : 00 60       =   0  60 (number of frames per seconds)

Track header :

	~00-03 : 4d 54 72 6b =  77  84 114 107 (MTrk)
	~04-07 : xx xx xx xx (length of track, excluding header, ie : 00 + 2 note on + 2 note off + 1 end of track = 20)

Relevent events :
	
	FF 02 ll xx+ 00 : Copyright notice
	FF 03 ll xx+ 00 : Sequence label
	FF 04 ll xx+ 00 : Instrument name
	FF 05 ll xx+ 00 : Lyric
	FF 06 ll xx+ 00 : Marker
	FF 07 ll xx+ 00 : Cue point
	FF 7F ll xx+ 00 : Sequencer specific meta-event

	FF 51 03 tt 00 : Tempo
	FF 58 04 nn dd cc bb 00 : Time signature
	FF 59 02 xx xx 00 : Key signature

	80 nn vv 00 : Note off, note, velocity
	90 nn vv 00 : Note on, note, velocity

	FF 2f 00 : end of track

	lot of other events better left ignored for the time being


Implementation
--------------

The aim of the current implementation is to allow loading, manipulating and saving midi files.
Midi files with asynchronous tracks aren't currently supported.


Sources
-------

 * http://www.midi.org/techspecs/
 * http://www.fileformat.info/format/midi/corion.htm
 * http://faydoc.tripod.com/formats/mid.htm
 * https://ccrma.stanford.edu/~craig/articles/linuxmidi/misc/essenmidi.html
 * http://www.sonicspot.com/guide/midifiles.html
 * http://www.ccarh.org/courses/253/handout/vlv/
 * http://www.ccarh.org/courses/253/handout/smf/
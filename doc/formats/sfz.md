SFZ file format
===============

Outline
-------

	<group>
	key=..
	lokey=.. hikey=.. pitch_keycenter=.. //the group parameters are applied to all following regions
	<region>
	sample=......
	volume=..
	pan=..
	transpose=.. tune=..
	lorand=0 hirand=1 //round robin
	lovel=.. hivel=.. 
	lobpm=.. hibpm=.. //bpm layer
	seq_length=.. seq_position=.. //sequence
	offset=..
	end=..


Implementation
--------------

The following parameters are implemented :

 * sample
 * key, lokey and hikey
 * lorand and hirand
 * lovel and hivel
 * seq_length and seq_position

To be implemented :

 * offset
 * end
 * transpose
 * tune
 * pitch_keycenter
 * volume
 * pan
 * lobpm
 * hibpm


Sources
-------

Complete official specifications : http://www.cakewalk.com/DevXchange/article.aspx?aid=108
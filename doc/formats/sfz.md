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

 * a custom opcode to aleviate the format support issue in browsers
 * offset, offset_random and end, useful to limit the number of audio files to load
 * loop_mode, loop_start and loop_end
 * transpose and tune
 * pitch_keycenter, pitch_keytrack and pitch_random
 * volume
 * pan
 * lobpm and hibpm
 * lochan and hichan
 * sw_last, sw_lokey and sw_hikey
 * sw_up, sw_down and sw_previous
 * sw_vel
 * trigger


Sources
-------

 * Complete official specifications : http://www.cakewalk.com/DevXchange/article.aspx?aid=108
 * ARIA specific opcodes : http://ariaengine.com/forums/index.php?p=/discussion/4389/arias-custom-opcodes/p1
 * Peter L Jones' sfz bits : http://www.drealm.info/sfz/
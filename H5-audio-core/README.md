# H5-audio-core

H5-audio-core provides underlying logics, which contains lyrics parser, for an audio player. You can make a complete player by binding the logics to DOM. 


## Examples

	<script src="AudioCore.min.js"></script>

	let list = [
		{src: '/a.mp3', ...},
		{src: '/b.mp3', ...},
		...
	];
	
	AudioCore.init({
		list,
		play: true
	)};

Click [DEMO](https://nossika.github.io/H5-audio-core/demo.html) to try it!

## Init options

* **list** (type: Array, default: [])

	Its members are `Object` which represent the audio info.
	
	For example:
		
		// a list contains 3 audio
		[
			{src: '/name1.mp3', author: 'singer1', cover: '/pic1.jpg', lrc: '/name1.lrc'},
			{src: '/name2.mp3', author: 'singer2', cover: '/pic2.jpg', lrc: '/name2.lrc'},
			{src: '/name3.mp3', author: 'singer3', cover: '/pic3.jpg', lrc: '/name3.lrc'},
		]

	The `src` prop is required for each member, and it should be a valid audio src.

	Other props would be return on event `start` and `loaded`, so you can use them to update DOM.
	
	

* **play** (type: Boolean, default: false)

	Value `true` for autoplay after init, and `false` for not to autoplay.

* **cur** (type: Number, default: 0)

	Current audio index in list.

* **mode** (type: Number, default: 0)

	Value could be 0 / 1 / 2.

	0: normal mode, play next audio when end, and play next audio when `play_next`

	1: loop mode, play again when end, and play next audio when `play_next`

	2: random mode, play random audio when end, and play random audio when `play_next`

* **vol** (type: Number, default: 0.8)

	Audio volume, between 0 and 1.

## Methods

* **init(config)**

	Init AudioCore with config, check out **Init options** for detail.

* **on(event, callback)**

	params:

	* **event** (type: String)
	* **callback** (type: Function)

	Execute `callback` when `event` occurs.

	Check out **Events** for detail.


* **play([index])**

	params: 
	
	* **index** (optional, type: Number): stand for audio index in list

	Play audio. Or play specified audio if param `index` passed.

	
* **pause()**

	Pause audio.

* **play_next()**

	Play next audio.

* **play_pre()**

	Play previous audio.

* **mode(type)**

	params:

	* **type** (type: Number)

	Switch mode to `type`. Check out its detail on prop `mode` of **init options**.

* **vol(value)**

	params:

	* **value** (type: Number)

	Set audio volume to `value`. Valid range: 0 - 1.

* **info()**

	Return detail info.

	For example:

		AudioCore.info();
		/* 
			return {
				cur: 2, 
				vol: 0.6,
				mode: 2,
				pause: true,
				time: 122,
				duration: 230,
				list: [...]
			}
		*/
		

* **to_time(sec)**

	params:

	* **sec** (type: Number): target seconds of current audio

	Jump to target second. `sec` should be in `seekable`(native audio prop) range, otherwise this action will be ignored.


* **list_add(info)**

	params:
	
	* **info** (type: Object): audio info

	Add an audio by `info` to list.

* **list_remove(index)**

	params:

	* **index** (type: Number): audio index in list

	Remove an audio by `index` in list.

* **format_time(sec)**

	params:

	* **sec** (type: Number)

	Convert seconds to string like 'mm:ss' and return the string. For example, 67 would become '01:07'.

* **set_lrc(lrc)**

	params:

	* **lrc** (type: String): the string read from lrc file

	Check out on **Lrc parser** for detail.

* **cur_lrc(sec)**

	params:

	* **sec** (type: Number): target second

	Check out on **Lrc parser** for detail.

## Events

* **start**

	occur: native audio event `loadstart`

	param 1: current audio info in list, like `{src: '/name1.mp3', author: 'singer1', cover: '/pic1.jpg', lrc: '/name1.lrc'}`

* **loaded**

	occur: native audio event `loadedmetadata`

	param 1: the same info in event `start` with native audio prop `duration`

* **play**

	occur: native audio event `timeupdate`

	param 1: an Object, prop `cur` shows current time, and prop `total` shows audio duration

* **buffer**

	occur: native audio event `progress`

	param 1: an Array for buffered area, like `[[0, 19], [55, 101]]`

* **end**

	occur: native audio event `ended`

	param 1: the same info in event `start`

## Lrc parser

There are 2 methods, `set_lrc` and `cur_lrc`, for lrc system.

Usually, we get format lrc string named `lrc_str` by ajax. And execute `set_lrc(lrc_str)` to set lrc on current audio.

 (`set_lrc(lrc_str)` would return an Object contains lyrics info like `{'3': 'hello', '12': 'hey yoo', ...}` , Its key
 is time and its value is the lyric for the time. It can be used to generate full lyrics on your page)

Then, execute `cur_lrc(sec)` to get lyrics for target `sec`. The method returns an Object with time-lrc like `{time: '3', lrc: 'hello'}`. Usually, we use this function on the callback of event `play`.

If execute `set_lrc(lrc_str)` again, new value would override the old.

For example:

	let lrc_stc = '[00:03.00] hello \n [00:12.13] hey yoo \n ...';	

	AudioCore.set_lrc(lrc_str); // return {'3': 'hello', '12': 'hey yoo', ...}

	AudioCore.get_lrc(3); // return {time: '3', lrc: 'hello'}
	AudioCore.get_lrc(4.5); // return {time: '3', lrc: 'hello'}
	AudioCore.get_lrc(14); // return {time: '12', lrc: 'hey yoo'}

	

## Tips

* what you set in init option `list`, what you get on event `start` / `loaded` / `end`.

* Set callback on event `start` to change audio info. Set callback on event `play` / `buffer` to update progress.
	
* Remember to set new lrc by `set_lrc` when audio changes.

* Why `list_add` / `list_remove` ? Why not modify list directly ?

	Because the random mode needs indexes for no-repeat. Use `list_add` / `list_remove` would resync the indexes to make it work correctly.
	





	
	

	



	

	


	

var chokidar = require('chokidar');
var {CasparCG} = require('casparcg-connection')
var mediaHelper = require('./lib/mediaHelper.js');
var libqueue = require('./lib/queue.js');
var parser = require('./lib/parser.js');
var fs = require('fs');
var config;

var connection;// = new CasparCG({onConnected: connected});
var clips = {Playlist: []};
var queue;
var timetable;
var watched = [];
var mediaFolder;
var playbackDirectories;

// data part of casparcg-connection response from cls connection
// example dummy data
var library = [
	{ name: 'DAILY/CLIP1', type: 'video', size: 6445960, changed: 1481832374000, frames: 268, frameTime: '1/25', frameRate: 25, duration: 10.72 },
	{ name: 'DAILY/CLIP2', type: 'video', size: 6445960, changed: 1481832374000, frames: 268, frameTime: '1/25', frameRate: 25, duration: 10.72 },
	{ name: 'DAYS/SUNDAY/CLIP1', type: 'video', size: 6445960, changed: 1481832374000, frames: 268, frameTime: '1/25', frameRate: 25, duration: 10.72 },
	{ name: 'DAYS/SUNDAY/CLIP1', type: 'video', size: 6445960, changed: 1481832374000, frames: 268, frameTime: '1/25', frameRate: 25, duration: 10.72 }
]

queue = libqueue(connection);

try {
    config = JSON.parse(fs.readFileSync('./config.json'));
    console.log('parsed conf ', config)
}
catch (err) {
    console.log('error parsing config!');
	process.exit();
}

function timesChanged () {
    parser.execute(timetable, library);
}

var timesFile = chokidar.watch(config.timetable);

timesFile.on('change', () => {
	let times = fs.readFileSync(config.timetable);

	try {
		timetable = JSON.parse(times);
		timesChanged();
	}
	catch (err) {
		console.log('error parsing config!');
	}
})

try {
	let times = fs.readFileSync(config.timetable);
	timetable = JSON.parse(times);
	timesChanged();
}
catch (err) {
	console.log('error parsing config!', err);
}

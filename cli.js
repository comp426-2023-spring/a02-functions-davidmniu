#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2))

if ("h" in argv) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n",
    			"-h            Show this help message and exit.\n",
				"-n, -s        Latitude: N positive; S negative.\n",
				"-e, -w        Longitude: E positive; W negative.\n",
				"-z            Time zone: uses tz.guess() from moment-timezone by default.\n",
				"-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n",
				"-j            Echo pretty JSON from open-meteo API and exit.");
	process.exit(0);
}

import moment from "moment-timezone";

const timezone = moment.tz.guess()

var n;
if ("n" in argv) {
	n = parseInt(argv["n"]);
	n = n.toFixed(2);
} else if ("s" in argv) {
	n = parseInt(argv["s"])*-1;
	n = n.toFixed(2);
} else {
    console.log("Latitude must be in range");
	process.exit(0);
}

var e;
if ("e" in argv) {
	e = parseInt(argv["e"]);
	e = e.toFixed(2);
} else if ("w" in argv) {
	e = parseInt(argv["w"]);
	e = e.toFixed(2);
} else {
    console.log("Longitude must be in range");
	process.exit(0);
}

var d;
if ("d" in argv) {
	d = parseInt(argv["d"]);
} else {
	d = 1;
}

var z;
if ("z" in argv) {
	z = argv["z"];
} else {
	z = timezone;
}

var url = "https://api.open-meteo.com/v1/forecast?latitude=" + n + "&longitude=" + e + "&daily=precipitation_hours&timezone=" + z;

const response = await fetch(url);
const data = await response.json();

if ("j" in argv) {
	console.log(data);
	process.exit(0);
}

const rain = data.daily.precipitation_hours[d];
var output;
if (rain == 0) {
	output = "you will not need your galoshes ";
} else {
	output = "you will need your galoshes ";
}

if (d == 0) {
	output += "today";
} else if (d == 1) {
	output += "tomorrow";
} else {
	output += "in " + d + " days";
}

console.log(output);

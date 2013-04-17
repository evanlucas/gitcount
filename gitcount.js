#!/usr/bin/env node
var exec = require('child_process').exec
  , colors = require('colors')
  , Table = require('cli-table');

var table = new Table({
	head: ['Commit', 'Additions', 'Deletions']
});

var commits = {};
var results = [];
exec('git --no-pager whatchanged --oneline --numstat --since="1 day ago"', function(err, stdout, stderr) {
	if (err) {
		console.log(colors.red('ERROR'), err);
		process.exit(1);
	} else {
		if (stdout) {
			var lines = stdout.split("\n");
			var len = lines.length;
			for (var i=0; i<len; i++) {
				var line = lines[i];
				if (line == "") continue;
				var commit;
				if (matches = line.match(/([a-fA-F0-9]{7}) (.*)/)) {
					commit = matches[1];
					commits[commit] = {
						adds: 0,
						dels: 0
					};
				}
				if (matches = line.match(/([\d-]+)([\s]+)([\d-]+)([\s]+)(.*)/)) {
					var adds = matches[1];
					var dels = matches[3];
					if (adds != "-") {
						commits[commit].adds += Number(adds);
					}
					if (dels != "-") {
						commits[commit].dels += Number(dels);
					}
				}
			}
			for (com in commits) {
				var c = commits[com];
				var hash = com;
				var adds = c.adds;
				var dels = c.dels;
				table.push([hash, colors.magenta(adds), colors.red(dels)]);
			}
			console.log(table.toString());
		} else {
			console.log(table.toString());
			process.exit();
		}
	}
});

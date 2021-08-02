#!/usr/bin/env node

// Native resources to copy
var androidNativePath = 'android/';

// Android platform resource path
var androidResPath = 'platforms/android/res/';

// Copy native resources
var rootdir = process.argv[2];

var fs = require('fs');
var path = require('path');

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    process.stdout.write('Copying ' + source + ' to ' + targetFile);
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    //var targetFolder = path.join( target, path.basename( source ) );
    var targetFolder = target;
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
        process.stdout.write('fs.mkdirSync( ' + targetFolder + ' )');
    }

	console.log('targetFolder : ' + targetFolder);

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
			console.log('curSource : ' +curSource)
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                var newTarget = path.join( targetFolder, path.basename( curSource ) );
                copyFolderRecursiveSync( curSource, newTarget );
                process.stdout.write('copyFolderRecursiveSync(' + curSource + ', ' + newTarget + ' )');
            } else {
                copyFileSync( curSource, targetFolder );
                process.stdout.write('copyFileSync(' + curSource + ', ' + targetFolder + ' )');
            }
        } );
    }
}

if (rootdir) {
	console.log('rootdir : ' + rootdir);
    copyFolderRecursiveSync(androidNativePath, androidResPath);
    process.stdout.write('Copied android native resources');
}
"use strict";

// Native resources to copy
var androidNativePath = 'android/';

// Android platform resource path
var androidResPath = 'platforms/android/res/';

var utils = require("./utilities");
// Copy native resources
var rootdir = './';

var fs = require('fs');
var path = require('path');
var parseString = require("xml2js").parseString;
var xml2js = require("xml2js");

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

module.exports = function(context) {
	var cordovaAbove8 = utils.isCordovaAbove(context, 8);
	var cordovaAbove7 = utils.isCordovaAbove(context, 7);
	var defer;
	if (cordovaAbove8) {
		defer = require("q").defer();
	} else {
		defer = context.requireCordovaModule("q").defer();
	}

	console.log('Current directory: ' + process.cwd() );
	console.log('project root : ' + context.opts.projectRoot )
	
	if (rootdir) {
		console.log('[rootdir] : ' + rootdir);
		fs.readdirSync(rootdir).forEach(file => {
			console.log(file);
		});
		console.log('[plugins]');
		fs.readdirSync( path.join(rootdir,'plugins') ).forEach(file => {
			console.log(file);
		});
		console.log('[platforms]');
		fs.readdirSync( path.join(rootdir,'platforms') ).forEach(file => {
			console.log(file);
		});
		console.log('[android]');
		fs.readdirSync( path.join(rootdir,'platforms/android') ).forEach(file => {
			console.log(file);
		});
		/*
		var targetFolderRes = path.join(context.opts.projectRoot, 'platforms/android/res');
		if ( !fs.existsSync( targetFolderRes ) ) {
			fs.mkdirSync( targetFolderRes );
			process.stdout.write('fs.mkdirSync( ' + targetFolderRes + ' )');
		}	
		
		var targetFolderXml = path.join(context.opts.projectRoot, 'platforms/android/res/xml');
		if ( !fs.existsSync( targetFolderXml ) ) {
			fs.mkdirSync( targetFolderXml );
			process.stdout.write('fs.mkdirSync( ' + targetFolderXml + ' )');
		}*/
		//fs.mkdirSync( './platforms/android/app/src/main/res/' );
		copyFileSync( path.join(context.opts.projectRoot, 'plugins/voice/android/actions.xml'), path.join(context.opts.projectRoot, '/platforms/android/app/src/main/res/xml') );
		//copyFolderRecursiveSync(androidNativePath, androidResPath);
		//process.stdout.write('Copied android native resources');
		var queries = '<string-array name="QueriesBeneficios">'+
		'<item>beneficios pedidos ya</item>'+
        '<item>beneficio pedido ya</item>'+
        '<item>pedidos ya</item>'+
    '</string-array>'+
    '<string-array name="QueriesMisBoletas">'+
        '<item>boleta</item>'+
        '<item>boletas</item>'+
        '<item>mis boletas</item>'+
        '<item>la boleta</item>'+
    '</string-array>'+
    '<string-array name="QueriesStarbucks">'+
        '<item>estarbaks</item>'+
        '<item>starbucks</item>'+
        '<item>cafe</item>'+
    '</string-array>'+
	'</resources>';
	
		var manifestActions = '<platform name="android"><edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/application"><meta-data android:name="com.google.android.actions" android:resource="@xml/actions" /></edit-config>'
	
		fs.readFile( path.join(context.opts.projectRoot, '/platforms/android/app/src/main/res/values/strings.xml') , "utf-8", function(err,data ) {
			if (err) console.log(err);
			
			console.log(typeof data);
			console.log(data.length);
			console.log(data);
			console.log(queries);
			
			var result = data.replace(/<\/resources>/g, queries);
			console.log(result);
			
			fs.writeFile(path.join(context.opts.projectRoot, '/platforms/android/app/src/main/res/values/strings.xml'), result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		});
		
		/*fs.readFile( path.join(context.opts.projectRoot, '/config.xml') , "utf-8", function(err,data ) {
			if (err) console.log(err);
			console.log('---');
			console.log(data);
			
			var result = data.replace(/<platform name="android">/g, manifestActions);
			console.log('---');
			console.log(result);
			
			fs.writeFile(path.join(context.opts.projectRoot, '/config.xml'), result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			
		});*/

	}
	
	return defer.promise;
}


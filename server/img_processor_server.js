var hostname = 'sbose.sendgrid.com' ; // '127.0.0.1'


//var execSync = require('child_process').execSync;
var util = require('util');
var express = require('express');
var multer  = require('multer');
var app = express();


var cmd = "./image_processor.sh 50% %s %s "; // ./uploads/ea75b360f5acaadb41564c05ca655eb0.JPG ./uploads/result-script.jpg" ;
var zip_cmd = "tar -cf  " ; 

var sendgrid_api_key = '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';

var nodemailer = require('nodemailer');


var sendgrid = require("sendgrid")( sendgrid_api_key );

function send_mail( to , subject , body ){

	var email = new sendgrid.Email();

	email.addTo(to);
	email.setFrom("sbose78@gmail.com");//@sendgrid.sbose.in");
	email.setSubject(subject);
	email.setHtml(body);

	sendgrid.send(email , function(err, json) {
	  if (err) { return console.error(err); }
	  log_msg(json);
	});
}

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
 

app.set('port', 8123);
app.use(multer({ dest: './uploads/'}))
app.use(express.static(__dirname + '/uploads'));


function compress_images( req ) {
  var execSync = require('child_process').execSync;

  var compressed_list = [];

  var num_attachments = req.body.attachments;
  console.log( req.files );
  for (i = 1; i <= num_attachments; i++){
    var attachment = req.files['attachment' + i];
    var uploaded_path =  attachment.path ;
    var original_name =  attachment.originalname ;
    var compressed_path = "./uploads/compressed-"+original_name ; //(( attachment );


    // compress image
    var run_cmd = util.format( cmd , uploaded_path , compressed_path );
    log_msg( "Executing ... " + run_cmd ) ;
    execSync(run_cmd, function(error, stdout, stderr) {
       log_msg( stdout );
       //compressed_list.push ( compressed_path ) ;
       //log_msg ( 'contents of file list : ' + compressed_list ) ;
    });
    
    compressed_list.push ( compressed_path ) ;
  }
   if ( compressed_list.length == 1 ) {

	var t = compressed_list[0].split('/') ;
	return t[2] ;
    }

	// zip the whole thing.
  	var ct = new Date().getTime()      ;
	var zip_name = 'compressed-' + ct + '.zip'; 
        var zip_path = './uploads/' + zip_name ;
	var zip_cmd_images = zip_cmd + ' ' + zip_path + ' '  ;

	log_msg ( 'contents of file list : ' + compressed_list ) ;
	//  Lets append the filenames to be zippped.
	for ( var i = 0 ; i < compressed_list.length ; i=i+1 )
	{
		zip_cmd_images = zip_cmd_images + ' ' + compressed_list[i] ;
	}

	// zipping...
        log_msg( "Executing.. " + zip_cmd_images ) ;
        execSync = require('child_process').execSync;

	execSync( zip_cmd_images , function( error, stdout, stderr ) {
		log_msg( stdout ) ;
	});

	// only zip name returned because '/uploads' has been configured to server static files        
        return zip_name ;
        log_msg( "Zipped into " + zip_name ) ;
}

app.post('/mail/', function (req, res) {
  var from = req.body.from;
  var text = req.body.text;
  var subject = req.body.subject;
  var num_attachments = req.body.attachments;
  log_msg( from + " *** " + subject );


  /*
  console.log( req.files ); 
  for (i = 1; i <= num_attachments; i++){
    var attachment = req.files['attachment' + i];
    var uploaded_path =  attachment.path ;
    var original_name =  attachment.originalname ;
     
    var compressed_path = "./uploads/compressed-"+original_name	; //(( attachment );
    //compress_img();
    var run_cmd = util.format( cmd , uploaded_path , compressed_path );
    exec(run_cmd, function(error, stdout, stderr) {
       log_msg( stdout );	
       //send_mail( from , subject , 'sendgrid.sbose.in/compressed-'+original_name );
    });
     send_mail( from , subject , 'sendgrid.sbose.in/compressed-'+original_name );

    // attachment will be a File object
  } */

  if ( num_attachments > 0 ) { 
	  var output = compress_images( req ) ; 
	 send_mail( from , subject , 'sendgrid.sbose.in/' + output );
  }
  else{
	log_msg( "Nothign to process");
  }
  log_msg( from + " *** " + subject ); 
  res.send( 'OK' ) ;
 });



app.post('/compress/', function( req  , res ) {

	 var execSync = require('child_process').execSync;
	 var compressed_list = [];

	
	console.log( req.files )
        var all_files = req.files['image'] ;
	for ( var i = 0 ; i < all_files.length ; i++ ) {


		    var attachment = all_files[0];
		    var uploaded_path =  attachment.path ;
		    var original_name =  attachment.originalname ;
		    var compressed_path = "./uploads/compressed-"+original_name ; //(( attachment );


		    // compress image
		    var run_cmd = util.format( cmd , uploaded_path , compressed_path );
		    log_msg( "Executing ... " + run_cmd ) ;
		    execSync(run_cmd, function(error, stdout, stderr) {
		            log_msg( stdout );
		
		       //compressed_list.push ( compressed_path ) ;
		       //log_msg ( 'contents of file list : ' + compressed_list ) ;
		     });

		    compressed_list.push ( compressed_path ) ;
  	}
   	if ( compressed_list.length == 1 ) {

        	var t = compressed_list[0].split('/') ;
	        return t[2] ;
    	}

        // zip the whole thing.
        var ct = new Date().getTime()      ;
        var zip_name = 'compressed-' + ct + '.zip';
        var zip_path = './uploads/' + zip_name ;
        var zip_cmd_images = zip_cmd + ' ' + zip_path + ' '  ;

        log_msg ( 'contents of file list : ' + compressed_list ) ;
        //  Lets append the filenames to be zippped.
        for ( var i = 0 ; i < compressed_list.length ; i=i+1 )
        {
                zip_cmd_images = zip_cmd_images + ' ' + compressed_list[i] ;
        }

        // zipping...
        log_msg( "Executing.. " + zip_cmd_images ) ;
        execSync = require('child_process').execSync;

        execSync( zip_cmd_images , function( error, stdout, stderr ) {
                log_msg( stdout ) ;
        });

        // only zip name returned because '/uploads' has been configured to server static files
	
       
        log_msg( "Zipped into " + zip_name ) ;


	var obj = { 'a' : zip_name } ;
	res.jsonp(obj);

});

/*

app.get('/compress/', function( req  , res ) {
        console.log("OK. we got something " + req.body + req.files );
        var obj = { 'a' : 'a' } ;
        res.jsonp(req.query.callback + '('+ JSON.stringify(obj) + ');');
});
*/

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});


var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false
});


function log_msg(msg){
        console.log( msg );
        logger.info( msg ) ;
}
           

/*
var execFile = require('child_process').execFile;
exexFile(file, args, options, function(error, stdout, stderr) {
  // command output is in stdout
});
*/
//var exec = require('child_process').exec;
//var compress_img = exec(cmd, function(error, stdout, stderr) {
//  log_msg( stdout ); 
//}); 


app.get('/', function(req, res){
  res.sendfile('../sample.html');
});

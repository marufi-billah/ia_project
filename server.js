var HTTP = require('http');
var URL = require('url');
var FS = require('fs');
qs = require('querystring');
var Candidate = require('./model/candidate');

HTTP.createServer(function(request, response){
    var url_object = URL.parse(request.url, true);

    //Serving api request if /api path is defined in url
    //Follow API Documents for more details.
    if(url_object.pathname == '/api'){
        if(request.method == 'POST'){
            var body='';
            request.on('data', function (data) {
                body +=data;
            });
            request.on('end',function(){
                var POST =  qs.parse(body);
                
                if(POST['action'] == 'load_candidate'){

                    //Model Loading and updating example

                    var candidate = new Candidate();
                    candidate.load(POST['id']).then(() => {
                        console.log(candidate.id);
                        console.log(candidate.full_name);
                        console.log(candidate.username);

                        candidate.phone = "01207199584";

                        candidate.save().then(() => {
                            console.log("Candidate successfully updated!");
                            console.log(candidate.phone);
                        }).catch((reason) => {
                            console.log(reason);
                        })
                    }).catch((reason) => {
                        console.log(reason);
                    });

                    //Example end.
                }
                
                response.end();
            });
        }
    }
    else{
    //Serving static file from static folder.
    //index.html is default file, and error.html if requested file not exist.
        if(url_object.pathname == '/' || url_object.pathname == ''){
            FS.readFile('./static/index.html', function(error, data){
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
                response.end();
            });
        }
        else{
            FS.readFile('./static'+url_object.pathname, function(error, data){
                if(error){
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    FS.readFile('./static/error.html', function(error, error_file){
                        response.write(error_file);
                        response.end();
                    });
                }
                else{
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(data);
                    response.end();
                }
            })  
        }
    }
}).listen(4321);
console.log("Server Started at port: 4321");
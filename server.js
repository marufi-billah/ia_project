var HTTP = require('http');
var URL = require('url');
var FS = require('fs');
var Database = require('./modules/database');

HTTP.createServer(function(request, response){
    var url_object = URL.parse(request.url, true);

    //Serving api request if /api path is defined in url
    //Follow API Documents for more details.
    if(url_object.pathname == '/api'){

        //================================================================
        //Database connection test, this should be inside model classes.
        //================================================================
        var db_instance = new Database();
        var db_conn = db_instance.get_connection();
        db_conn.query("SELECT VERSION()", function(error, result){
            if(error) console.log(error);
            else console.log(result);
        });
        response.end();
        //================================================================
        //End of database connection.
        //================================================================
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
var mime = require('mime');
var HTTP = require('http');
var URL = require('url');
var FS = require('fs');
qs = require('querystring');
var User = require('./middleware/user');

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

                //Candidate Registration
                if(POST['action'] == 'register_candidate'){
                    if(POST['full_name'] !== undefined && POST['email'] !== undefined && POST['password'] !== undefined && POST['username'] !== undefined){
                        var user = new User();
                        user.register_candidate(POST['full_name'], POST['email'], POST['password'], POST['username']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Email duplication check
                if(POST['action'] == 'check_email'){
                    if(POST['email'] !== undefined){
                        var user = new User();
                        user.check_email(POST['email']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Username duplication check
                if(POST['action'] == 'check_username'){
                    if(POST['username'] !== undefined){
                        var user = new User();
                        user.check_username(POST['username']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Candidate Login
                if(POST['action'] == 'candidate_login'){
                    if(POST['email'] !== undefined, POST['password']){
                        var user = new User();
                        user.candidate_login(POST['email'], POST['password']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //HR Login
                if(POST['action'] == 'hr_login'){
                    if(POST['email'] !== undefined, POST['password']){
                        var user = new User();
                        user.hr_login(POST['email'], POST['password']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //User logout
                if(POST['action'] == 'user_logout'){
                    if(POST['auth_token'] !== undefined){
                        var user = new User();
                        user.user_logout(POST['auth_token']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get user information
                if(POST['action'] == 'get_user_info'){
                    if(POST['auth_token'] !== undefined){
                        var user = new User();
                        user.get_user_info(POST['auth_token']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
                //Get Candidate information
                if(POST['action'] == 'get_candidate_info'){
                    if(POST['auth_token'] !== undefined && POST['candidate_id'] !== undefined){
                        var user = new User();
                        user.get_candidate_info(POST['auth_token'], POST['candidate_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
                //Update candidate phone number
                if(POST['action'] == 'update_candidate_phone'){
                    if(POST['auth_token'] !== undefined && POST['phone'] !== undefined){
                        var user = new User();
                        user.update_candidate_phone(POST['auth_token'], POST['phone']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
                //Update candidate cv
                if(POST['action'] == 'update_candidate_cv'){
                    if(POST['auth_token'] !== undefined && POST['cv_link'] !== undefined){
                        var user = new User();
                        user.update_candidate_cv(POST['auth_token'], POST['cv_link']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
                //Update candidate position
                if(POST['action'] == 'update_candidate_position'){
                    if(POST['auth_token'] !== undefined && POST['position_id'] !== undefined){
                        var user = new User();
                        user.update_candidate_position(POST['auth_token'], POST['position_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
                //Update candidate approval
                if(POST['action'] == 'update_candidate_approval'){
                    if(POST['auth_token'] !== undefined && POST['candidate_id'] !== undefined && POST['approval'] !== undefined){
                        var user = new User();
                        user.update_candidate_approval(POST['auth_token'], POST['candidate_id'], POST['approval']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get positions
                if(POST['action'] == 'get_positions'){
                    var user = new User();
                    user.get_positions().then((data) => {
                        parsed_data = JSON.parse(data);
                        response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                        response.write(data);
                        response.end();
                    }).catch((data) => {
                        parsed_data = JSON.parse(data);
                        response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                        response.write(data);
                        response.end();
                    });
                }

                //Get candidates
                if(POST['action'] == 'get_candidates'){
                    if(POST['auth_token'] !== undefined){
                        var user = new User();
                        user.get_candidates(POST['auth_token']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Exams
                if(POST['action'] == 'get_exams'){
                    if(POST['auth_token'] !== undefined){
                        var user = new User();
                        user.get_exams(POST['auth_token']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Exam
                if(POST['action'] == 'get_exam'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.get_exam(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Add Exam
                if(POST['action'] == 'add_exam'){
                    if(POST['auth_token'] !== undefined && POST['name'] !== undefined && POST['description'] !== undefined){
                        var user = new User();
                        user.add_exam(POST['auth_token'], POST['name'], POST['description']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Update Exam
                if(POST['action'] == 'update_exam'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined && POST['name'] !== undefined && POST['description'] !== undefined){
                        var user = new User();
                        user.update_exam(POST['auth_token'], POST['id'], POST['name'], POST['description']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Delete Exam
                if(POST['action'] == 'delete_exam'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.delete_exam(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Questions
                if(POST['action'] == 'get_questions'){
                    if(POST['auth_token'] !== undefined && POST['exam_id'] !== undefined){
                        var user = new User();
                        user.get_questions(POST['auth_token'], POST['exam_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Question
                if(POST['action'] == 'get_question'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.get_question(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Add Question
                if(POST['action'] == 'add_question'){
                    if(POST['auth_token'] !== undefined && POST['question'] !== undefined && POST['exam_id'] !== undefined){
                        var user = new User();
                        user.add_question(POST['auth_token'], POST['question'], POST['exam_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Update Question
                if(POST['action'] == 'update_question'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined && POST['question'] !== undefined){
                        var user = new User();
                        user.update_question(POST['auth_token'], POST['id'], POST['question']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Delete Question
                if(POST['action'] == 'delete_question'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.delete_question(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Answers
                if(POST['action'] == 'get_answers'){
                    if(POST['auth_token'] !== undefined && POST['question_id'] !== undefined){
                        var user = new User();
                        user.get_answers(POST['auth_token'], POST['question_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Get Answer
                if(POST['action'] == 'get_answer'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.get_answer(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Add Answer
                if(POST['action'] == 'add_answer'){
                    if(POST['auth_token'] !== undefined && POST['answer'] !== undefined && POST['correct'] !== undefined && POST['question_id'] !== undefined){
                        var user = new User();
                        user.add_answer(POST['auth_token'], POST['answer'], POST['correct'] ,POST['question_id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Update Answer
                if(POST['action'] == 'update_answer'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined && POST['answer'] !== undefined && POST['correct'] !== undefined){
                        var user = new User();
                        user.update_answer(POST['auth_token'], POST['id'], POST['answer'], POST['correct']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }

                //Delete Answer
                if(POST['action'] == 'delete_answer'){
                    if(POST['auth_token'] !== undefined && POST['id'] !== undefined){
                        var user = new User();
                        user.delete_answer(POST['auth_token'], POST['id']).then((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        }).catch((data) => {
                            parsed_data = JSON.parse(data);
                            response.writeHead(parsed_data['code'], {'Content-Type': 'application/json'});
                            response.write(data);
                            response.end();
                        });
                    }
                    else{
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.write('{"status":"error","code":"400","message":"Invalid request!"}');
                        response.end();
                    }
                }
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
                var file_url = './static'+url_object.pathname;
                if(error){
                    response.setHeader("Content-Type", mime.getType('./static/error.html'));
                    response.writeHead(404);
                    FS.readFile('./static/error.html', function(error, error_file){
                        response.write(error_file);
                        response.end();
                    });
                }
                else{
                    response.setHeader("Content-Type", mime.getType(file_url));
                    response.writeHead(200);
                    response.write(data);
                    response.end();
                }
            })  
        }
    }
}).listen(4321);
console.log("Server Started at port: 4321");
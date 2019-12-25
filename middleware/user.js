var Database = require('../modules/database');
var Candidate = require('../model/candidate');
var HR = require('../model/hr');
var Position = require('../model/position');
var Exam = require('../model/exam');
var Question = require('../model/question');
var Answer = require('../model/answer');
var Session = require('../model/session');
var Crypto = require('crypto');

class User {
    connection;

    constructor(){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();
    }

    register_candidate(full_name, email, password, username){
        return new Promise((resolve, reject) => {
            if(full_name !== undefined && email !== undefined && password !== undefined && username !== undefined){
                var candidate = new Candidate();
                return candidate.create(full_name, email, password, username).then(() => {
                    var response = {status: "success", code: 200, message: "Candidate registered successfully"}
                    resolve(JSON.stringify(response));
                }).catch((reason) => {
                    console.log(reason);
                    var response = {status: "failed", code: 500, message: "Failed to register candidate because of system error."}
                    reject(JSON.stringify(response));
                });
            }
            else{
                var response = {status: "error", code: 400, message: "Invalid Parameter!"}
                reject(JSON.stringify(response));
            }
        });
    }
    check_email(email){
        return new Promise((resolve, reject) => {
            var self = this;
            if(email !== undefined){
                self.connection.query("SELECT * FROM candidates WHERE email=?;",[email], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        var response = {status: "failed", code: 500, message: "Failed to check email duplication because of system error."}
                        reject(JSON.stringify(response));
                    }
                    else{
                        if(result.length > 0){
                            var response = {status: "duplicate", code: 200, message: "Email is already registered!"}
                            resolve(JSON.stringify(response));
                        }
                        else{
                            var response = {status: "unique", code: 200, message: "Email is not registered yet!"}
                            resolve(JSON.stringify(response));
                        }
                    }
                });
            }
            else{
                var response = {status: "error", code: 400, message: "Invalid Parameter!"}
                reject(JSON.stringify(response));
            }
        });
    }
    check_username(username){
        return new Promise((resolve, reject) => {
            var self = this;
            if(username !== undefined){
                self.connection.query("SELECT * FROM candidates WHERE username=?;",[username], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        var response = {status: "failed", code: 500, message: "Failed to check username duplication because of system error."}
                        reject(JSON.stringify(response));
                    }
                    else{
                        if(result.length > 0){
                            var response = {status: "duplicate", code: 200, message: "Username is already registered!"}
                            resolve(JSON.stringify(response));
                        }
                        else{
                            var response = {status: "unique", code: 200, message: "Username is not registered yet!"}
                            resolve(JSON.stringify(response));
                        }
                    }
                });
            }
            else{
                var response = {status: "error", code: 400, message: "Invalid Parameter!"}
                reject(JSON.stringify(response));
            }
        });
    }
    candidate_login(email, password){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM candidates WHERE email=?", [email],
            (error, result) => {
                if(error){
                    console.log(error);
                    var response = {status: "failed", code: 500, message: "Candidate logging in failed because of system error."}
                    reject(JSON.stringify(response));
                }
                else{
                    if(result.length > 0){
                        if(result[0]['password'] == password){
                            var time = new Date().getTime();
                            var crypto_string = email + password + time.toString();
                            var id = Crypto.createHash('sha256').update(crypto_string).digest('hex');
                            var expire = Math.floor((time + (24 * 60 * 60 * 1000))/1000);
                            var user_type = "candidate";
                            var user_id = result[0]['id'];

                            //Cleaning previous sessions
                            this.connection.query("DELETE FROM sessions WHERE user_id=? AND user_type=?;", [user_id, user_type],
                            (error, result) => {
                                if(error){
                                    console.log(error);
                                }
                            });

                            var session = new Session();
                            return session.create(id, user_id, user_type, expire).then(() => {
                                var response = {status: "success", code: 200, auth_token: id, message: "User successfully logged in!"}
                                reject(JSON.stringify(response));
                            }).catch((reason) => {
                                console.log(reason);
                                var response = {status: "error", code: 403, message: "Candidate login failed!"}
                                reject(JSON.stringify(response));
                            });
                        }
                        else{
                            var response = {status: "error", code: 403, message: "Incorrect password!"}
                            reject(JSON.stringify(response));
                        }
                    }
                    else{
                        var response = {status: "error", code: 404, message: "Email is not registered!"}
                        reject(JSON.stringify(response));
                    }
                }
            });
        });
    }
    hr_login(email, password){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM hrs WHERE email=?", [email],
            (error, result) => {
                if(error){
                    console.log(error);
                    var response = {status: "failed", code: 500, message: "HR logging in failed because of system error."}
                    reject(JSON.stringify(response));
                }
                else{
                    if(result.length > 0){
                        if(result[0]['password'] == password){
                            var time = new Date().getTime();
                            var crypto_string = email + password + time.toString();
                            var id = Crypto.createHash('sha256').update(crypto_string).digest('hex');
                            var expire = Math.floor((time + (24 * 60 * 60 * 1000))/1000);
                            var user_type = "hr";
                            var user_id = result[0]['id'];

                            //Cleaning previous sessions
                            this.connection.query("DELETE FROM sessions WHERE user_id=? AND user_type=?;", [user_id, user_type],
                            (error, result) => {
                                if(error){
                                    console.log(error);
                                }
                            });

                            var session = new Session();
                            return session.create(id, user_id, user_type, expire).then(() => {
                                var response = {status: "success", code: 200, auth_token: id, message: "User successfully logged in!"}
                                reject(JSON.stringify(response));
                            }).catch((reason) => {
                                console.log(reason);
                                var response = {status: "error", code: 403, message: "HR login failed!"}
                                reject(JSON.stringify(response));
                            });
                        }
                        else{
                            var response = {status: "error", code: 403, message: "Incorrect password!"}
                            reject(JSON.stringify(response));
                        }
                    }
                    else{
                        var response = {status: "error", code: 404, message: "Email is not registered!"}
                        reject(JSON.stringify(response));
                    }
                }
            });
        });
    }
    user_logout(auth_token){
        return new Promise((resolve, reject) => {
            var session = new Session();
            return session.load(auth_token).then(() => {
                return session.delete().then(() => {
                    var response = {status: "success", code: 200, message: "User logged out successfully!"}
                    resolve(JSON.stringify(response));
                }).catch((reason) => {
                    console.log(reason);
                    var response = {status: "failed", code: 500, message: "Unable to logging out user!"}
                    reject(JSON.stringify(response));
                });
            }).catch((reason) => {
                console.log(reason);
                var response = {status: "error", code: 403, message: "Invalid auth token!"}
                reject(JSON.stringify(response));
            })
        })
    }
    check_user_login(auth_token){
        return new Promise((resolve, reject) => {
            var session = new Session();
            return session.load(auth_token).then(() => {
                var expire = parseInt(session.expire) * 1000;
                if(expire > new Date().getTime()){
                    var user_id = session.user_id;
                    var user_type = session.user_type;

                    if(user_type == 'candidate'){
                        var candidate = new Candidate();
                        return candidate.load(user_id).then(() => {
                            resolve({user_type: "candidate", data: candidate});
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to fetch candidate infromation!"}
                            reject(JSON.stringify(response));
                        })
                    }
                    else if(user_type == 'hr'){
                        var hr = new HR();
                        return hr.load(user_id).then(() => {
                            resolve({user_type: "hr", data: hr});
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to fetch HR infromation!"}
                            reject(JSON.stringify(response));
                        })
                    }
                }
                else{
                    var response = {status: "error", code: 403, message: "User session expired, please login again."}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                console.log(reason);
                var response = {status: "error", code: 403, message: "Invalid auth_token"}
                reject(JSON.stringify(response));
            });
        });
    }
    get_user_info(auth_token){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'candidate'){
                    var candidate = user.data;
                    if(candidate.position_id !== null){
                        var position = new Position();
                        return position.load(candidate.position_id).then(() => {
                            var approval = (candidate.approval == 0) ? "not approved" : "approved";
                            var response = {
                                status: "success", 
                                code: 200, 
                                message: "",
                                user_type: "candidate",
                                id: candidate.id,
                                name: candidate.full_name,
                                email: candidate.email,
                                username: candidate.username,
                                phone: candidate.phone,
                                approval: approval,
                                cv_link: candidate.cv_link,
                                position_id: candidate.position_id,
                                position: { name: position.name, description: position.description }
                            }
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            reject(reason);
                        });
                    }
                    else{
                        var approval = (candidate.approval == 0) ? "not approved" : "approved";
                        var response = {
                            status: "success", 
                            code: 200, 
                            message: "",
                            user_type: "candidate",
                            id: candidate.id,
                            name: candidate.full_name,
                            email: candidate.email,
                            username: candidate.username,
                            phone: candidate.phone,
                            approval: approval,
                            cv_link: candidate.cv_link,
                            position_id : candidate.position_id
                        }
                        resolve(JSON.stringify(response));
                    }
                }
                else if(user_type == 'hr'){
                    var hr = user.data;
                    var response = {
                        status: "success", 
                        code: 200, 
                        message: "",
                        user_type: "hr",
                        id: hr.id,
                        name: hr.name,
                        email: hr.email,
                    }
                    resolve(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_candidate_phone(auth_token, phone){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'candidate'){
                    var candidate = user.data;
                    candidate.phone = phone;
                    return candidate.save().then(() => {
                        var response = {status: "success", code: 200, message: "Candidate phone number updated successfully!"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 500, message: "Unable to update candidate phone number!"}
                        reject(JSON.stringify(response));
                    })
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_candidate_cv(auth_token, cv_link){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'candidate'){
                    var candidate = user.data;
                    candidate.cv_link = cv_link;
                    return candidate.save().then(() => {
                        var response = {status: "success", code: 200, message: "Candidate CV updated successfully!"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 500, message: "Unable to update candidate CV!"}
                        reject(JSON.stringify(response));
                    })
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_candidate_position(auth_token, position_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'candidate'){
                    var candidate = user.data;
                    candidate.position_id = position_id;
                    return candidate.save().then(() => {
                        var response = {status: "success", code: 200, message: "Candidate position updated successfully!"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 500, message: "Unable to update candidate position!"}
                        reject(JSON.stringify(response));
                    })
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_candidate_approval(auth_token, candidate_id, approval){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var candidate = new Candidate();
                    return candidate.load(candidate_id).then(() => {
                        candidate.approval = approval;
                        return candidate.save().then(() => {
                            var response = {status: "success", code: 200, message: "Candidate approval updated successfully!"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Unable to update candidate approval!"}
                            reject(JSON.stringify(response));
                        })
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 500, message: "Unable to update candidate approval!"}
                        reject(JSON.stringify(response));
                    })
                    
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_positions(){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM positions", function(error, result){
                if(error){
                    console.log(error);
                    var response = {status: "failed", code: 500, message: "Unable to retrieve positions!"}
                    reject(JSON.stringify(response));
                }
                else{
                    if(result.length > 0){
                        var response = {
                            status: "success", 
                            code: 200, 
                            message: "",
                            positions: result
                        }
                        resolve(JSON.stringify(response));
                    }
                    else{
                        var response = {status: "error", code: 404, message: "No position available!"}
                        reject(JSON.stringify(response))
                    }
                }
            });
        });
    }
    get_candidates(auth_token){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    this.connection.query("SELECT id, full_name, email, cv_link, phone, username, approval, position_id FROM candidates", function(error, result){
                        if(error){
                            console.log(error);
                            var response = {status: "failed", code: 500, message: "Unable to retrieve candidates!"}
                            reject(JSON.stringify(response));
                        }
                        else{
                            if(result.length > 0){
                                var response = {
                                    status: "success", 
                                    code: 200, 
                                    message: "",
                                    candidates: result
                                }
                                resolve(JSON.stringify(response));
                            }
                            else{
                                var response = {status: "error", code: 404, message: "No candidates available!"}
                                reject(JSON.stringify(response))
                            }
                        }
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_candidate_info(auth_token, candidate_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var candidate = new Candidate();
                    return candidate.load(candidate_id).then(() => {
                        if(candidate.position_id !== null){
                            var position = new Position();
                            return position.load(candidate.position_id).then(() => {
                                var approval = (candidate.approval == 0) ? "not approved" : "approved";
                                var response = {
                                    status: "success", 
                                    code: 200, 
                                    message: "",
                                    user_type: "candidate",
                                    id: candidate.id,
                                    name: candidate.full_name,
                                    email: candidate.email,
                                    username: candidate.username,
                                    phone: candidate.phone,
                                    approval: approval,
                                    cv_link: candidate.cv_link,
                                    position_id: candidate.position_id,
                                    position: { name: position.name, description: position.description }
                                }
                                resolve(JSON.stringify(response));
                            }).catch((reason) => {
                                console.log(reason);
                                reject(reason);
                            });
                        }
                        else{
                            var approval = (candidate.approval == 0) ? "not approved" : "approved";
                            var response = {
                                status: "success", 
                                code: 200, 
                                message: "",
                                user_type: "candidate",
                                id: candidate.id,
                                name: candidate.full_name,
                                email: candidate.email,
                                username: candidate.username,
                                phone: candidate.phone,
                                approval: approval,
                                cv_link: candidate.cv_link,
                                position_id : candidate.position_id
                            }
                            resolve(JSON.stringify(response));
                        }
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Candidate not found!"}
                        reject(JSON.stringify(response));
                    })
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_exams(auth_token){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    this.connection.query("SELECT * FROM exams", function(error, result){
                        if(error){
                            console.log(error);
                            var response = {status: "failed", code: 500, message: "Unable to retrieve exams!"}
                            reject(JSON.stringify(response));
                        }
                        else{
                            if(result.length > 0){
                                var response = {
                                    status: "success", 
                                    code: 200, 
                                    message: "",
                                    exams: result
                                }
                                resolve(JSON.stringify(response));
                            }
                            else{
                                var response = {status: "error", code: 404, message: "No exams available!"}
                                reject(JSON.stringify(response))
                            }
                        }
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_exam(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var exam = new Exam();
                return exam.load(id).then(() => {
                    var response = {
                        status: "success", 
                        code: 200, 
                        message: "",
                        exam: {id: exam.id, name: exam.name, description: exam.description}
                    }
                    resolve(JSON.stringify(response));
                }).catch((reason) => {
                    console.log(reason);
                    var response = {status: "error", code: 404, message: "Failed load exam!"}
                    reject(JSON.stringify(response));
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    add_exam(auth_token, name, description){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var exam = new Exam();
                    return exam.create(name, description).then(() => {
                        var response = {status: "success", code: 200, message: "Exam added successfully"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to add exam!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_exam(auth_token, id, name, description){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var exam = new Exam();
                    return exam.load(id).then(() => {
                        exam.name = name;
                        exam.description = description;

                        return exam.save().then(() => {
                            var response = {status: "success", code: 200, message: "Exam updated successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to update exam!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load exam!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    delete_exam(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var exam = new Exam();
                    return exam.load(id).then(() => {
                        return exam.delete().then(() => {
                            var response = {status: "success", code: 200, message: "Exam deleted successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to delete exam!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load exam!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_questions(auth_token, exam_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                this.connection.query("SELECT * FROM questions WHERE exam_id=?",[exam_id], function(error, result){
                    if(error){
                        console.log(error);
                        var response = {status: "failed", code: 500, message: "Unable to retrieve Questions!"}
                        reject(JSON.stringify(response));
                    }
                    else{
                        if(result.length > 0){
                            var response = {
                                status: "success", 
                                code: 200, 
                                message: "",
                                questions: result
                            }
                            resolve(JSON.stringify(response));
                        }
                        else{
                            var response = {status: "error", code: 404, message: "No questions available!"}
                            reject(JSON.stringify(response))
                        }
                    }
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_question(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var question = new Question();
                return question.load(id).then(() => {
                    var response = {
                        status: "success", 
                        code: 200, 
                        message: "",
                        question: {id: question.id, question: question.question, exam_id: question.exam_id}
                    }
                    resolve(JSON.stringify(response));
                }).catch((reason) => {
                    console.log(reason);
                    var response = {status: "error", code: 404, message: "Failed load Question!"}
                    reject(JSON.stringify(response));
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    add_question(auth_token, question_text, exam_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var question = new Question();
                    return question.create(question_text, exam_id).then(() => {
                        var response = {status: "success", code: 200, message: "Question added successfully"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to add question!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_question(auth_token, id, question_text){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var question = new Question();
                    return question.load(id).then(() => {
                        question.question = question_text;

                        return question.save().then(() => {
                            var response = {status: "success", code: 200, message: "Question updated successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to update question!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load question!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    delete_question(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var question = new Question();
                    return question.load(id).then(() => {
                        return question.delete().then(() => {
                            var response = {status: "success", code: 200, message: "Question deleted successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to delete question!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load question!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_answers(auth_token, question_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                this.connection.query("SELECT * FROM answers WHERE question_id=?",[question_id], function(error, result){
                    if(error){
                        console.log(error);
                        var response = {status: "failed", code: 500, message: "Unable to retrieve Answers!"}
                        reject(JSON.stringify(response));
                    }
                    else{
                        if(result.length > 0){
                            var response = {
                                status: "success", 
                                code: 200, 
                                message: "",
                                answers: result
                            }
                            resolve(JSON.stringify(response));
                        }
                        else{
                            var response = {status: "error", code: 404, message: "No answers available!"}
                            reject(JSON.stringify(response))
                        }
                    }
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    get_answer(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var answer = new Answer();
                return answer.load(id).then(() => {
                    var response = {
                        status: "success", 
                        code: 200, 
                        message: "",
                        answer: {id: answer.id, answer: answer.answer, correct: answer.correct, question_id: answer.question_id}
                    }
                    resolve(JSON.stringify(response));
                }).catch((reason) => {
                    console.log(reason);
                    var response = {status: "error", code: 404, message: "Failed load Answer!"}
                    reject(JSON.stringify(response));
                });
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    add_answer(auth_token, answer_text, correct, question_id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var answer = new Answer();
                    return answer.create(answer_text, correct, question_id).then(() => {
                        var response = {status: "success", code: 200, message: "Answer added successfully"}
                        resolve(JSON.stringify(response));
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to add answer!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    update_answer(auth_token, id, answer_text, correct){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var answer = new Answer();
                    return answer.load(id).then(() => {
                        answer.answer = answer_text;
                        answer.correct = correct;

                        return answer.save().then(() => {
                            var response = {status: "success", code: 200, message: "Answer updated successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to update answer!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load answer!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
    delete_answer(auth_token, id){
        return new Promise((resolve, reject) => {
            return this.check_user_login(auth_token).then((user) => {
                var user_type = user.user_type;
                if(user_type == 'hr'){
                    var answer = new Answer();
                    return answer.load(id).then(() => {
                        return answer.delete().then(() => {
                            var response = {status: "success", code: 200, message: "Answer deleted successfully"}
                            resolve(JSON.stringify(response));
                        }).catch((reason) => {
                            console.log(reason);
                            var response = {status: "error", code: 500, message: "Failed to delete answer!"}
                            reject(JSON.stringify(response));
                        });
                    }).catch((reason) => {
                        console.log(reason);
                        var response = {status: "error", code: 404, message: "Failed to load answer!"}
                        reject(JSON.stringify(response));
                    });
                }
                else{
                    var response = {status: "error", code: 403, message: "You are not allowed to perform this action!"}
                    reject(JSON.stringify(response));
                }
            }).catch((reason) => {
                reject(reason);
            });
        });
    }
}

module.exports = User;
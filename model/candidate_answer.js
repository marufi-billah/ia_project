var Database = require('../modules/database');

class CandidateAnswer {
    id = null;
    candidate_id = null;
    exam_id = null;
    answers = "";

    connection;
    constructor(id, candidate_id, exam_id, answers){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && candidate_id !== undefined && exam_id !== undefined && answers !== undefined){
            this.id = id;
            this.candidate_id = candidate_id;
            this.exam_id = exam_id;
            this.answers = answers;
        }
    }

    create(candidate_id, exam_id, answers){
        return new Promise((resolve, reject) => {
            var self = this;

            if(candidate_id !== undefined && exam_id !== undefined && answers !== undefined){
                self.connection.query("INSERT INTO candidates_answers(candidate_id, exam_id, answers) VALUES(?,?,?);",
                [candidate_id, exam_id, answers], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.candidate_id = candidate_id;
                        self.exam_id = exam_id;
                        self.answers = answers;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create Candidate Answer, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM candidates_answers WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.candidate_id = result[0]['candidate_id'];
                            self.exam_id = result[0]['exam_id'];
                            self.answers = result[0]['answers'];
                            resolve(true);
                        }
                        else{
                            console.log("Resource", "No matching resource found in database!");
                            reject({error: "Resource not found!"});
                        }
                    }
                });
            }
            else{
                console.log("Resource", "Unable to load candidate answer, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM candidates_answers WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.candidate_id = null;
                        self.exam_id = null;
                        self.answers = "";
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete candidate answer, candidate answer is not loaded!");
                reject({error: "Invalid candidate answer id, maybe candidate answer is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE candidates_answers SET candidate_id=?, exam_id=?, answers=? WHERE id=?;",
                [self.candidate_id, self.exam_id, self.answers, self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to update candidate answer, candidate answer is not loaded!");
                reject({error: "Invalid candidate answer id, maybe candidate answer is not loaded from database!"});
            }
        });
    }
}

module.exports = CandidateAnswer;
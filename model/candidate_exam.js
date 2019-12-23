var Database = require('../modules/database');

class CandidateExam {
    id = null;
    candidate_id = null;
    deadline = "2019-12-30";
    sequence = 0;
    exam_id = null;

    connection;
    constructor(id, candidate_id, deadline, sequence, exam_id){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && candidate_id !== undefined && deadline !== undefined &&
            sequence !== undefined && exam_id !== undefined){
            this.id = id;
            this.candidate_id = candidate_id;
            this.deadline = deadline;
            this.sequence = sequence;
            this.exam_id = exam_id;
        }
    }

    create(candidate_id, deadline, exam_id, sequence){
        return new Promise((resolve, reject) => {
            var self = this;
            var sequence_tmp = this.sequence;
            if(sequence === undefined) sequence_tmp = sequence;

            if(candidate_id !== undefined && deadline !== undefined && exam_id !== undefined){
                self.connection.query("INSERT INTO candidates_exams(candidate_id, deadline, sequence, exam_id) VALUES(?,?,?,?);",
                [candidate_id, deadline, sequence_tmp, exam_id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.candidate_id = candidate_id;
                        self.deadline = deadline;
                        self.sequence = sequence_tmp;
                        self.exam_id = exam_id;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create Candidate Exam, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM candidates_exams WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.candidate_id = result[0]['candidate_id'];
                            self.deadline = result[0]['deadline'];
                            self.sequence = result[0]['sequence'];
                            self.exam_id = result[0]['exam_id'];
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
                console.log("Resource", "Unable to load candidate exam, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM candidates_exams WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.candidate_id = null;
                        self.deadline = "2019-12-30";
                        self.sequence = 0;
                        self.exam_id = null;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete candidate exam, candidate exam is not loaded!");
                reject({error: "Invalid candidate exam id, maybe candidate exam is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE candidates_exams SET candidate_id=?, deadline=?, sequence=?, exam_id=? WHERE id=?;",
                [self.candidate_id, self.deadline, self.sequence, self.exam_id, self.id], 
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
                console.log("Resource", "Unable to update candidate exam, candidate exam is not loaded!");
                reject({error: "Invalid candidate exam id, maybe candidate exam is not loaded from database!"});
            }
        });
    }
}

module.exports = CandidateExam;
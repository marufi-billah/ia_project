var Database = require('../modules/database');

class Question {
    id = null;
    question = "";
    exam_id = null;

    connection;
    constructor(id, question, exam_id){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && question !== undefined && exam_id !== undefined){
            this.id = id;
            this.question = question;
            this.exam_id = exam_id;
        }
    }

    create(question, exam_id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(question !== undefined && exam_id !== undefined){
                self.connection.query("INSERT INTO questions(question, exam_id) VALUES(?, ?);",[question, exam_id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.question = question;
                        self.exam_id = exam_id;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create question, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM questions WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.question = result[0]['question'];
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
                console.log("Resource", "Unable to load question, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM questions WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.question = "";
                        self.exam_id = null;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete question, question is not loaded!");
                reject({error: "Invalid question id, maybe question is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE questions SET question=?, exam_id=? WHERE id=?;",[self.question, self.exam_id, self.id], 
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
                console.log("Resource", "Unable to update question, question is not loaded!");
                reject({error: "Invalid question id, maybe question is not loaded from database!"});
            }
        });
    }
}

module.exports = Question;
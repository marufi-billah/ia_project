var Database = require('../modules/database');

class Answer {
    id = null;
    answer = "";
    correct = 0;
    question_id = null;

    connection;
    constructor(id, answer, correct, question_id){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && answer !== undefined && correct !== undefined && question_id !== undefined){
            this.id = id;
            this.answer = answer;
            this.correct = correct;
            this.question_id = question_id;
        }
    }

    create(answer, correct, question_id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(answer !== undefined && correct !== undefined && question_id !== undefined){
                self.connection.query("INSERT INTO answers(answer, correct, question_id) VALUES(?,?,?);",
                [answer, correct, question_id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.answer = answer;
                        self.correct = correct;
                        self.question_id = question_id;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create answer, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM answers WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.answer = result[0]['answer'];
                            self.correct = result[0]['correct'];
                            self.question_id = result[0]['question_id'];
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
                console.log("Resource", "Unable to load answer, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM answers WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.answer = "";
                        self.correct = 0;
                        self.question_id = null;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete answer, answer is not loaded!");
                reject({error: "Invalid amswer id, maybe answer is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE answers SET answer=?, correct=?, question_id=? WHERE id=?;",
                [self.answer, self.correct, self.question_id, self.id], 
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
                console.log("Resource", "Unable to update answer, answer is not loaded!");
                reject({error: "Invalid answer id, maybe answer is not loaded from database!"});
            }
        });
    }
}

module.exports = Answer;
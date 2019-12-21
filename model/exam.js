var Database = require('../modules/database');

class Exam {
    id = null;
    name = "";
    description = "";

    connection;
    constructor(id, name, description){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && name !== undefined && description !== undefined){
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    create(name, description){
        return new Promise((resolve, reject) => {
            var self = this;
            if(name !== undefined && description !== undefined){
                self.connection.query("INSERT INTO exams(name, description) VALUES(?, ?);",[name, description], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.name = name;
                        self.description = description;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create exam, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM exams WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.name = result[0]['name'];
                            self.description = result[0]['description'];
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
                console.log("Resource", "Unable to load exam, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM exams WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.name = "";
                        self.description = "";
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete exam, exam is not loaded!");
                reject({error: "Invalid exam id, maybe exam is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE exams SET name=?, description=? WHERE id=?;",[self.name, self.description, self.id], 
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
                console.log("Resource", "Unable to update exam, exam is not loaded!");
                reject({error: "Invalid exam id, maybe exam is not loaded from database!"});
            }
        });
    }
}

module.exports = Exam;
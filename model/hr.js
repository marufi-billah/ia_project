var Database = require('../modules/database');

class HR {
    id = null;
    email = "";
    password = "";
    name = "";

    connection;
    constructor(id, email, password, name){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && email !== undefined && password !== undefined && name !== undefined){
            this.id = id;
            this.email = email;
            this.password = password;
            this.name = name;
        }
    }

    create(email, password, name){
        return new Promise((resolve, reject) => {
            var self = this;
            if(email !== undefined && name !== undefined){
                self.connection.query("INSERT INTO hrs(email, password, name) VALUES(?, ?);",[email, password, name], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.email = email;
                        self.password = password;
                        self.name = name;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create HR, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM hrs WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.email = result[0]['email'];
                            self.password = result[0]['password'];
                            self.name = result[0]['name'];
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
                console.log("Resource", "Unable to load HR, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM hrs WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.email = "";
                        self.password = "";
                        self.name = "";
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete HR, HR is not loaded!");
                reject({error: "Invalid HR id, maybe HR is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE hrs SET email=?, password=?, name=? WHERE id=?;",[self.email, self.password, self.name, self.id], 
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
                console.log("Resource", "Unable to update HR, HR is not loaded!");
                reject({error: "Invalid HR id, maybe HR is not loaded from database!"});
            }
        });
    }
}

module.exports = HR;
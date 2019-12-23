var Database = require('../modules/database');

class Session {
    id = "";
    user_id = null;
    user_type = "";
    expire = "";

    connection;
    constructor(){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();
    }

    create(id, user_id, user_type, expire){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined && user_id !== undefined && user_type !== undefined && expire !== undefined){
                self.connection.query("INSERT INTO sessions(id, user_id, user_type, expire) VALUES(?,?,?,?);",
                [id, user_id, user_type, expire], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = id;
                        self.user_id = user_id;
                        self.user_type = user_type;
                        self.expire = expire;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create session, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM sessions WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.user_id = result[0]['user_id'];
                            self.user_type = result[0]['user_type'];
                            self.expire = result[0]['expire'];
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
                console.log("Resource", "Unable to load session, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM sessions WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = "";
                        self.user_id = null;
                        self.user_type = "";
                        self.expire = "";
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete session, session is not loaded!");
                reject({error: "Invalid session id, maybe session is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE sessions SET user_id=?, user_type=?, expire=? WHERE id=?;",
                [self.user_id, self.user_type, self.expire, self.id], 
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
                console.log("Resource", "Unable to update session, session is not loaded!");
                reject({error: "Invalid session id, maybe session is not loaded from database!"});
            }
        });
    }
}

module.exports = Session;
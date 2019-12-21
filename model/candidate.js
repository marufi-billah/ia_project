var Database = require('../modules/database');

class Candidate {
    id = null;
    full_name = "";
    email = "";
    cv_link = "";
    phone = "";
    username = "";
    approval = 0;
    position_id = null;

    connection;
    constructor(id, full_name, email, username, cv_link, phone, approval, position_id){
        var db_instance = new Database();
        this.connection = db_instance.get_connection();

        if(id !== undefined && full_name !== undefined && email !== undefined && cv_link !== undefined &&
            phone !== undefined && username !== undefined && approval !== undefined && position_id !== undefined){
            this.id = id;
            this.full_name = full_name;
            this.email = email;
            this.cv_link = cv_link;
            this.phone = phone;
            this.username = username;
            this.approval = approval;
            this.position_id = position_id;
        }
    }

    create(full_name, email, username, cv_link, phone, approval, position_id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(full_name !== undefined && email !== undefined && cv_link !== undefined &&phone !== undefined && 
                username !== undefined && approval !== undefined && position_id !== undefined){
                self.connection.query("INSERT INTO candidates(full_name, email, cv_link, phone, username, approval, position_id) VALUES(?,?,?,?,?,?,?);",
                [full_name, email, cv_link, phone, username, approval, position_id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.full_name = full_name;
                        self.email = email;
                        self.cv_link = cv_link;
                        self.phone = phone;
                        self.username = username;
                        self.approval = approval;
                        self.position_id = position_id;
                        resolve(true);
                    }
                });
            }
            else if(full_name !== undefined && email !== undefined  && username !== undefined){
                self.connection.query("INSERT INTO candidates(full_name, email, username) VALUES(?,?,?);",
                [full_name, email, username], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = result['insertId'];
                        self.full_name = full_name;
                        self.email = email;
                        self.cv_link = "";
                        self.phone = "";
                        self.username = username;
                        self.approval = 0;
                        self.position_id = null;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to create candidate, missing parameters!");
                reject({error: "missing parameter"});
            }
        });
    }

    load(id){
        return new Promise((resolve, reject) => {
            var self = this;
            if(id !== undefined){
                self.connection.query("SELECT * FROM candidates WHERE id=?;",[id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        if(result.length > 0){
                            self.id = result[0]['id'];
                            self.full_name = result[0]['full_name'];
                            self.email = result[0]['email'];
                            self.cv_link = result[0]['cv_link'];
                            self.phone = result[0]['phone'];
                            self.username = result[0]['username'];
                            self.approval = result[0]['approval'];
                            self.position_id = result[0]['position_id'];
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
                console.log("Resource", "Unable to load candidate, missing id!");
                reject({error: "missing parameter"});
            }
        });
    }

    delete(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("DELETE FROM candidates WHERE id=?;",[self.id], 
                (error, result) => {
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        self.id = null;
                        self.full_name = "";
                        self.email = "";
                        self.cv_link = "";
                        self.phone = "";
                        self.username = "";
                        self.approval = 0;
                        self.position_id = null;
                        resolve(true);
                    }
                });
            }
            else{
                console.log("Resource", "Unable to delete candidate, candidate is not loaded!");
                reject({error: "Invalid candidate id, maybe candidate is not loaded from database!"});
            }
        });
    }

    save(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(self.id !== null){
                self.connection.query("UPDATE candidates SET full_name=?, email=?, cv_link=?, phone=?, username=?, approval=?, position_id=? WHERE id=?;",
                [self.full_name, self.email, self.cv_link, self.phone, self.username, self.approval, self.position_id, self.id], 
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
                console.log("Resource", "Unable to update candidate, candidate is not loaded!");
                reject({error: "Invalid candidate id, maybe candidate is not loaded from database!"});
            }
        });
    }
}

module.exports = Candidate;
var mysql = require('mysql');

class Database {
    db_host = "localhost";
    db_name = "ia_project";
    db_user = "root";
    db_pass = "";
    connection;
    
    constructor(){
        this.connection = mysql.createConnection({
            host: this.db_host,
            user: this.db_user,
            password: this.db_pass,
            database: this.db_name
        });
        this.connection.connect(function(error){
            if(error){
                console.log(error);
            }
            else{
                console.log("Database connected successfully!");
            }
        });
    }
    get_connection(){
        return this.connection;
    }
}

module.exports = Database;
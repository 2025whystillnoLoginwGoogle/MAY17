<?php
class UserModel {
    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    public function registerUser($firstName, $lastName, $email, $hashedPassword, $role){
      
        $query = "INSERT INTO tbl_users (firstName, lastName, email, password, role , createdAt, updatedAt) VALUES (:firstName, :lastName, :email, :password,  :role , :createdAt, :updatedAt)";

         $dateNow = date(format: 'Y-m-d H:i:s');
        $response = $this->conn->prepare($query);
        $response->bindParam(":firstName", $firstName);
        $response->bindParam(":lastName", $lastName);
        $response->bindParam(":email", $email);
        $response->bindParam(":password", $hashedPassword);
        $response->bindParam(":role", $role);
        $response->bindParam(":createdAt", $dateNow);
        $response->bindParam(":updatedAt", $dateNow);
        
        try {
            return $response->execute();
        } catch (PDOException $e) {
            return false; 
        }
    }

    public function getUserByEmail($email){
        $query = "SELECT * FROM tbl_users WHERE email = :email LIMIT 1";
        $response = $this->conn->prepare($query);
        $response->bindParam(":email", $email);
        $response->execute();
        return $response->fetch(PDO::FETCH_ASSOC);
    }


    //for data table
    public function getAllUsers() {
        $query = "SELECT id, firstName, lastName, email, createdAt FROM tbl_users";
        $response = $this->conn->prepare($query);
        $response->execute();
        return $response->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteUser($id) {
        $query = "DELETE FROM tbl_users WHERE id = :id";
        $response = $this->conn->prepare($query);
        $response->bindParam(":id", $id);
        return $response->execute();
    }

    public function updateUser($id, $firstName, $lastName, $email) {
        $query = "UPDATE tbl_users SET firstName = :firstName, lastName = :lastName, email = :email, updatedAt = :updatedAt WHERE id = :id";
        $dateNow = date('Y-m-d H:i:s');
        $response = $this->conn->prepare($query);
        $response->bindParam(":firstName", $firstName);
        $response->bindParam(":lastName", $lastName);
        $response->bindParam(":email", $email);
        $response->bindParam(":updatedAt", $dateNow);
        $response->bindParam(":id", $id);
            
        try { return $response->execute(); } catch (PDOException $e) { return false; }
    }
}


?>
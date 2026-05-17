<?php
class Database {
    private $host = "localhost";
    private $dbName = "banksim_db";
    private $username = "root";
    private $password = "";

    public function connectDB() {
        try {
            $conn = new PDO(
                "mysql:host=$this->host;dbname=$this->dbName",
                $this->username,
                $this->password
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }
}
?>
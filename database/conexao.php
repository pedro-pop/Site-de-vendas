<?php 
// $hostName = "localhost";
// $dataBase = "ecommerce";
// $user = "root";
// $password = "";

// $bd = new mysqli(
//     $hostName,
//     $user,
//     $password,
//     $dataBase
// );

// if ($bd->connect_errno){
//     echo "Falha na conexão com o banco de dados:" . $bd->connect_error;
// }

    function connect(){
        $hostName = "localhost";
        $dataBase = "ecommerce";
        $user = "root";
        $password = "";

        try{
            $pdo = new PDO("mysql:host=$hostName; dbname=$dataBase", $user, $password);
            $pdo->exec("Set CHARACTER SET utf8");

        } catch (\Throwable $erro){
            return $erro;
            die;
        }

        return $pdo;

    }

?>
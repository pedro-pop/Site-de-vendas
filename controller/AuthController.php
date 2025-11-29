<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include __DIR__ . '/../model/ClienteDAO.php';

$dao = new ClienteDAO();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input["email"];
        $password = $input["password"];
        $clienteDAO = $dao->findByEmail($email);
        if ($clienteDAO === null){
            http_response_code(400);
            echo json_encode(['error' => 'Usuário com o email informado não encontrado']);
            return;
        }

        if($clienteDAO["password"] == $password){
            http_response_code(200);
            echo json_encode(['nome' => $clienteDAO["nome"], 'id'=> $clienteDAO["id"], 'lodago' => true ]);
            return;
        }else{
            http_response_code(401);
            echo json_encode(['error' => 'senha incorreta']);
            return;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
}

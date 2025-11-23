<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include __DIR__ . '/../model/ClienteDAO.php';

$dao = new ClienteDAO();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $cliente = $dao->findById((int)$_GET['id']);
            echo json_encode($cliente);
        } else {
            $clientes = $dao->findAll();
            echo json_encode($clientes);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $cliente = $dao->create($input);
        echo json_encode($cliente);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID é obrigatório']);
            exit;
        }
        $cliente = $dao->update((int)$input['id'], $input);
        echo json_encode($cliente);
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID é obrigatório']);
            exit;
        }
        $dao->delete((int)$input['id']);
        echo json_encode(['message' => 'Cliente deletado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
}

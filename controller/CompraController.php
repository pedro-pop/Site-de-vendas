<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include __DIR__ . '/../model/CompraDAO.php';

$dao = new CompraDAO();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $compraDAO = $dao->findById((int)$_GET['id']);
            echo json_encode($compraDAO);
        } else {
            $clientes = $dao->findAll();
            echo json_encode($clientes);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $compraDTO = new ComprasDTO(
            $input["id_cliente"],
            $input["id_produto"],
            $input["quantidade"],
            $input["subtotal"]
        );
        $compraDAO = $dao->create($compraDTO);
        echo json_encode($compraDAO);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID é obrigatório']);
            exit;
        }
        $compraDTO = new ComprasDTO(
            $input["id_cliente"],
            $input["id_produto"],
            $input["quantidade"],
            $input["subtotal"]
        );
        $compraDAO = $dao->update((int)$input['id'], $compraDTO);
        echo json_encode($compraDAO);
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

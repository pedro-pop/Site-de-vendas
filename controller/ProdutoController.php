<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include __DIR__ . '/../model/ProdutoDAO.php';

$dao = new ProdutoDAO();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method){
    case "GET":
        if (isset($_GET['id'])) {
            $produtoDAO = $dao->findById((int)$_GET['id']);
            echo json_encode($produtoDAO);
            
        } else {
            $produtoDAO = $dao->findAll();
            echo json_encode($produtoDAO);
        }
        break;
    
    case "POST":
        $input = json_decode(file_get_contents('php://input'), true);
        $produtoDTO = new ProdutoDTO(
            $input["nome"],
            $input["descricao"],
            $input["preco"],
            $input["quantidade"]
        );
        $produtoDAO = $dao->create($produtoDTO);
        echo json_encode($produtoDAO);
        break;
        break;
    
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID é obrigatório']);
            exit;
        }
        $produtoDTO = new ProdutoDTO(
            $input["nome"],
            $input["descricao"],
            $input["preco"],
            $input["quantidade"]
        );
        $produtoDAO = $dao->update((int)$input['id'], $produtoDTO);
        echo json_encode($produtoDAO);
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID é obrigatório']);
            exit;
        }
        $dao->delete((int)$input['id']);
        echo json_encode(['message' => 'Produto deletado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
}

?>
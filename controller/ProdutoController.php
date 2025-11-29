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
            http_response_code(200);
            echo json_encode($produtoDAO);
        }
        break;
    
    case "POST":
    $nome = $_POST["nome"];
    $descricao = $_POST["descricao"];
    $preco = $_POST["preco"];
    $quantidade = $_POST["quantidade"];

    // Tratar a imagem
    if(isset($_FILES["imagem"]) && $_FILES["imagem"]["error"] === 0){
        $imagem = $_FILES["imagem"];
        $nomeArquivo = time() . "-" . basename($imagem["name"]);
        $caminhoUpload = "../uploads/" . $nomeArquivo;

        if(move_uploaded_file($imagem["tmp_name"], $caminhoUpload)){
            // Caminho relativo ou absoluto para salvar no banco
            $caminhoDB = "uploads/" . $nomeArquivo;
        } else {
            $caminhoDB = null; // ou lidar com erro
        }
    } else {
        $caminhoDB = null;
    }

    // Criar DTO (incluindo caminho da imagem)
    $produtoDTO = new ProdutoDTO($nome, $descricao, $preco, $quantidade);

    $produtoDTO->img_path = $caminhoDB;

    // Salvar no banco
    $produtoDAO = $dao->create($produtoDTO);

    echo json_encode($produtoDAO->img_path = $caminhoDB);
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
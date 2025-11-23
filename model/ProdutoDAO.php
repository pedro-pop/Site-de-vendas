<?php
include("./database/conexao.php");
include("./dto/ProdutoDTO.php");

class ProdutoDAO {

    private $pdo;
    private $table = "produto";

    public function __construct()
    {
        $this->pdo = connect();
    }

    private function mapToDTO($linha)
    {
        return new ProdutoDTO(
            $linha["id"],
            $linha["nome"],
            $linha["descricao"],
            $linha["preco"],
            $linha["quantidade"],
            $linha["foto"] 
        );
    }

    /** @return ProdutoDTO[]|null */
    public function findAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM {$this->table}");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $lista = [];
        foreach ($rows as $row) {
            $lista[] = $this->mapToDTO($row);
        }

        return $lista;
    }

    /** @return ProdutoDTO|null */
    public function findById(int $id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(["id" => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->mapToDTO($row) : null;
    }

    /** @return ProdutoDTO|null */
    public function create(ProdutoDTO $produto){
    $sql = "INSERT INTO {$this->table} 
        (nome, descricao, preco, quantidade, foto)
        VALUES
        (:nome, :descricao, :preco, :quantidade, :foto)";

    $stmt = $this->pdo->prepare($sql);

    $stmt->execute([
        ":nome"      => $produto->nome,
        ":descricao" => $produto->descricao,
        ":preco"     => $produto->preco,
        ":quantidade"=> $produto->quantidade,
        ":foto"      => $produto->foto
    ]);

    $produto->id = (int) $this->pdo->lastInsertId();

    return $produto;
}


    /** @return ProdutoDTO|null */
    public function update(int $id, ProdutoDTO $produto){
        $sql = "UPDATE {$this->table} SET
            nome = :nome,
            descricao = :descricao,
            preco = :preco,
            quantidade = :quantidade,
            foto = :foto
        WHERE id = :id";

    $stmt = $this->pdo->prepare($sql);

    $stmt->execute([
        ":id"        => $id,
        ":nome"      => $produto->nome,
        ":descricao" => $produto->descricao,
        ":preco"     => $produto->preco,
        ":quantidade"=> $produto->quantidade,
        ":foto"      => $produto->foto
    ]);

    $produto->id = $id;

    return $produto;
}


    
    public function delete(int $id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }
}

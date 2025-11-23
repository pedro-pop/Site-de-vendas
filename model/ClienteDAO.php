<?php
include __DIR__ . '/../database/conexao.php';
include __DIR__ . '/../dto/ClienteDTO.php';

class ClienteDAO {
    private $pdo;
    private $table = "cliente";

    public function __construct()
    {
        $this->pdo = connect();
    }

    private function mapToDTO($linha)
    {
        return new ClienteDTO(
            $linha["id"],
            $linha["name"],
            $linha["password"],
            $linha["cep"],
            $linha["estado"],
            $linha["cidade"],
            $linha["bairro"],
            $linha["rua"],
            $linha["numero"],
            $linha["email"],
            $linha["cpf"],
            $linha["telefone"]
        );
    }

    /** @return ClienteDTO[] */
    public function findAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM $this->table");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $lista = [];
        foreach ($rows as $linha) {
            $lista[] = $this->mapToDTO($linha);
        }
        return $lista;
    }

    /** @return ClienteDTO */
    public function findById(int $id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM $this->table WHERE id = :id");
        $stmt->execute(['id' => $id]);

        $linha = $stmt->fetch(PDO::FETCH_ASSOC);
        return $linha ? $this->mapToDTO($linha) : null;
    }

    /** @return ClienteDTO */
    public function create(ClienteDTO $cliente)
    {
        $sql = "INSERT INTO {$this->table} 
        (name, password, cep, estado, cidade, bairro, rua, numero, email, cpf, telefone)
        VALUES 
        (:name, :password, :cep, :estado, :cidade, :bairro, :rua, :numero, :email, :cpf, :telefone)";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ":name"     => $cliente->name,
            ":password" => $cliente->password,
            ":cep"      => $cliente->cep,
            ":estado"   => $cliente->estado,
            ":cidade"   => $cliente->cidade,
            ":bairro"   => $cliente->bairro,
            ":rua"      => $cliente->rua,
            ":numero"   => $cliente->numero,
            ":email"    => $cliente->email,
            ":cpf"      => $cliente->cpf,
            ":telefone" => $cliente->telefone
        ]);

        $id = $this->pdo->lastInsertId();

        return $this->findById($id);
    }

   public function update(int $id, ClienteDTO $cliente)
{
    $sql = "UPDATE {$this->table} SET
        name = :name,
        password = :password,
        cep = :cep,
        estado = :estado,
        cidade = :cidade,
        bairro = :bairro,
        rua = :rua,
        numero = :numero,
        email = :email,
        cpf = :cpf,
        telefone = :telefone
    WHERE id = :id";

    $stmt = $this->pdo->prepare($sql);

    $stmt->execute([
        ":id"       => $id,
        ":name"     => $cliente->name,
        ":password" => $cliente->password,
        ":cep"      => $cliente->cep,
        ":estado"   => $cliente->estado,
        ":cidade"   => $cliente->cidade,
        ":bairro"   => $cliente->bairro,
        ":rua"      => $cliente->rua,
        ":numero"   => $cliente->numero,
        ":email"    => $cliente->email,
        ":cpf"      => $cliente->cpf,
        ":telefone" => $cliente->telefone
    ]);

    return $this->findById($id);
}


    public function delete(int $id)
    {
        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute(['id' => $id]);
    }
}
?>
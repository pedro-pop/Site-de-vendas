<?php 
    include("./database/conexao.php");
    include("./dto/ComprasDTO.php");

    class CompraDAO{
        private $pdo;
        private $table = "compra";

        public function __construct()
        {
            $this->pdo = connect();
        }

        /**
         * @return ComprasDTO[]
         */

        public function findAll(){
            $stmt = $this->pdo->query("SELECT * FROM $this->table");

            $compra_list = [];

             while($linha = $stmt->fetch(PDO::FETCH_ASSOC)){
                $compra = new ComprasDTO(
                    $linha["id"],
                    $linha["id_clinte"],
                    $linha["id_produto"],
                    $linha["quantidade"],
                    $linha["subtotal"]
                );

                $compra_list[] = $compra;
            }

            return $compra_list;
        }

        /** @return ComprasDTO|null */
        public function findById(int $id){
            $stmt = $this->pdo->prepare("SELECT * FROM $this->table WHERE id = :id");
            $stmt->execute([":id"=> $id]);
            $linha = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$linha){
                return null;
            }

            $compra = new ComprasDTO(
                $linha["id"],
                $linha["id_cliente"],
                $linha["id_produto"],
                $linha["quantidade"],
                $linha["subtotal"]
            );

            return $compra;
        }

        /**
        * @return ComprasDTO|null
        */
        public function create(ComprasDTO $dto): ?ComprasDTO
        {
            $sql = "INSERT INTO {$this->table} 
                    (id_cliente, id_produto, quantidade, subtotal)
                    VALUES (:id_cliente, :id_produto, :quantidade, :subtotal)";

            $stmt = $this->pdo->prepare($sql);

            $ok = $stmt->execute([
                ":id_cliente" => $dto->id_cliente,
                ":id_produto" => $dto->id_produto,
                ":quantidade" => $dto->quantidade,
                ":subtotal"   => $dto->subtotal,
            ]);

            if (!$ok) {
                return null;
            }

            $dto->id = (int) $this->pdo->lastInsertId();

            return $dto;
        }


        /**
        * @return ComprasDTO|null
        */
        public function update(ComprasDTO $dto): ?ComprasDTO
        {
            $sql = "UPDATE {$this->table}
                    SET id_cliente = :id_cliente,
                        id_produto = :id_produto,
                        quantidade = :quantidade,
                        subtotal   = :subtotal
                    WHERE id = :id";

            $stmt = $this->pdo->prepare($sql);

            $ok = $stmt->execute([
                ":id"         => $dto->id,
                ":id_cliente" => $dto->id_cliente,
                ":id_produto" => $dto->id_produto,
                ":quantidade" => $dto->quantidade,
                ":subtotal"   => $dto->subtotal,
            ]);

            if (!$ok) {
                return null;
            }

            return $dto;
        }

        
        public function delete(int $id): bool{

            $sql = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);

            return $stmt->execute([":id" => $id]);
        }



    }

?>
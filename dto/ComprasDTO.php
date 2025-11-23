<?php 

    class ComprasDTO{
        public int $id;
        public int $id_cliente;
        public int $id_produto;
        public int $quantidade;
        public float $subtotal;

        public function __construct(int $id, int $id_cliente, int $id_produto, int $quantidade, float $subtotal)
        {
            $this->id = $id;
            $this->id_cliente = $id_cliente;
            $this->id_produto = $id_produto;
            $this->quantidade = $quantidade;
            $this->subtotal = $subtotal;
        }
    }


?>
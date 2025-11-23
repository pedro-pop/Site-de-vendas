<?php

class ProdutoDTO {
    public $id;
    public $nome;
    public $descricao;
    public $preco;
    public $quantidade;
    public $foto;

    public function __construct(
        $id,
        $nome,
        $descricao,
        $preco,
        $quantidade,
        $foto
    ){
        $this->id = $id;
        $this->nome = $nome;
        $this->descricao = $descricao;
        $this->preco = $preco;
        $this->quantidade = $quantidade;
        $this->foto = $foto;
    }
}

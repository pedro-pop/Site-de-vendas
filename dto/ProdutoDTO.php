<?php

class ProdutoDTO {
    public $id;
    public $nome;
    public $descricao;
    public $preco;
    public $quantidade;


    public function __construct(
        $nome,
        $descricao,
        $preco,
        $quantidade,
    ){
        $this->nome = $nome;
        $this->descricao = $descricao;
        $this->preco = $preco;
        $this->quantidade = $quantidade;
    }
    public function setID($id){
        return $this->id = $id;
    }
}

<?php

class ClienteDTO
{
    public int $id;
    public string $name;
    public string $password;
    public string $cep;
    public string $estado;
    public string $cidade;
    public string $bairro;
    public string $rua;
    public int $numero;
    public string $email;
    public string $cpf;
    public string $telefone;

    public function __construct(
        int $id,
        string $name,
        string $password,
        string $cep,
        string $estado,
        string $cidade,
        string $bairro,
        string $rua,
        int $numero,
        string $email,
        string $cpf,
        string $telefone,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->password = $password;
        $this->cep = $cep;
        $this->estado = $estado;
        $this->cidade = $cidade;
        $this->bairro = $bairro;
        $this->rua = $rua;
        $this->numero = $numero;
        $this->email = $email;
        $this->cpf = $cpf;
        $this->telefone = $telefone;
    }
}

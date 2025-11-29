-- --------------------------------------------------
-- Arquivo: create_tables.sql
-- Banco de dados: Site-de-Vendas
-- --------------------------------------------------

-- Criação da tabela cliente
CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cep VARCHAR(20),
    estado VARCHAR(50),
    cidade VARCHAR(50),
    bairro VARCHAR(50),
    rua VARCHAR(100),
    numero VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cpf VARCHAR(20) UNIQUE,
    telefone VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criação da tabela produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    img_path VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criação da tabela compras
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
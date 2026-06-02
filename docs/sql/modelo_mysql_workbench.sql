-- FreelanceFlow - Modelo profissional para MySQL Workbench
-- Aluno: Victor Hideichi Mancini Suzuki
-- Cardinalidades:
-- Cliente 1:N Projeto
-- Projeto 1:N Atividade
-- Atividade 1:N RegistroHora
-- Projeto 1:N Pagamento
-- Usuario independente para autenticacao e administracao do sistema.

CREATE DATABASE IF NOT EXISTS freelanceflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE freelanceflow;

CREATE TABLE usuario (
  id CHAR(36) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuario_email (email)
) ENGINE=InnoDB;

CREATE TABLE cliente (
  id CHAR(36) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cliente_email (email)
) ENGINE=InnoDB;

CREATE TABLE projeto (
  id CHAR(36) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('EM_ANDAMENTO', 'CONCLUIDO', 'PAUSADO', 'CANCELADO') NOT NULL DEFAULT 'EM_ANDAMENTO',
  cliente_id CHAR(36) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_projeto_cliente (cliente_id),
  CONSTRAINT fk_projeto_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES cliente(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE atividade (
  id CHAR(36) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  status ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
  projeto_id CHAR(36) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_atividade_projeto (projeto_id),
  CONSTRAINT fk_atividade_projeto
    FOREIGN KEY (projeto_id)
    REFERENCES projeto(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE registro_hora (
  id CHAR(36) NOT NULL,
  horas_trabalhadas DECIMAL(10,2) NOT NULL,
  atividade_id CHAR(36) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_registro_hora_atividade (atividade_id),
  CONSTRAINT chk_registro_hora_horas CHECK (horas_trabalhadas > 0),
  CONSTRAINT fk_registro_hora_atividade
    FOREIGN KEY (atividade_id)
    REFERENCES atividade(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pagamento (
  id CHAR(36) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  metodo ENUM('PIX', 'CARTAO', 'BOLETO', 'TRANSFERENCIA', 'DINHEIRO') NOT NULL DEFAULT 'PIX',
  status ENUM('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  projeto_id CHAR(36) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pagamento_projeto (projeto_id),
  CONSTRAINT chk_pagamento_valor CHECK (valor > 0),
  CONSTRAINT fk_pagamento_projeto
    FOREIGN KEY (projeto_id)
    REFERENCES projeto(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

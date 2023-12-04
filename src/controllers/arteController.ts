const fs = require("fs");
const Arte = require("../models/Arte");
const storageFirebase = require("../uploadMiddleware"); 

exports.create = async (req: any, res: any) => {
  try {
    const { nome_artista, nome, uf, cidade, descricao, endereco } = req.body;
    const nomeDoArquivoFirebase = req.body.nomeDoArquivoFirebase;
    console.log(nomeDoArquivoFirebase);
    if (!nomeDoArquivoFirebase) {
      return res.status(400).json({ message: "Nenhuma imagem foi enviada." });
    }

    const arte = new Arte({
      nome_artista,
      nome,
      foto: nomeDoArquivoFirebase,
      descricao,
      uf,
      cidade,
      endereco,
    });

    await arte.save();
    res.status(201).json(arte);
  } catch (err) {
    console.error("Erro ao salvar a imagem:", err);
    res.status(500).json({ message: "Erro interno ao salvar a imagem." });
  }
};

;

exports.remove = async (req: any, res: any) => {
  try {
    const arte = await Arte.findById(req.params.id);
    if (!arte) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }

    // Excluir a imagem do Firebase Storage
    await storageFirebase.deleteFromStorage(arte.foto);

    // Remover a arte do banco de dados
    await arte.remove();

    res.json({ message: "Imagem removida com sucesso" });
  } catch (err) {
    console.error("Erro ao remover a imagem:", err);
    res.status(500).json({ message: "Erro ao remover a imagem" });
  }
};


exports.findAll = async (req: any, res: any) => {
  try {
    const arte = await Arte.find();
    res.json(arte);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar as imagens." });
  }
};
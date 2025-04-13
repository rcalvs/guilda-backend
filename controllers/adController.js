
exports.listAd = (req, res) => {
  res.json([{id: 1, nome: "João"}, {id: 2, nome: "Maria"}]);
};

exports.createAd = (req, res) => {
  const novoUsuario = req.body;
  res.status(201).json({mensagem: "Usuário criado!", usuario: novoUsuario});
};

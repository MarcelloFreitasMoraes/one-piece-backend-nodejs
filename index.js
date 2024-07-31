const express = require("express");
const app = express();
const port = 3000;

// Importe os dados dos personagens
const characters = require("./characters");

// Importe o Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');

// Rota para exibir a documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /characters:
 *   get:
 *     summary: Obtém todos os personagens com suporte a filtragem e paginação
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do personagem para filtrar
 *       - in: query
 *         name: fruit
 *         schema:
 *           type: string
 *         description: Nome da fruta para filtrar
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de personagens paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de personagens
 *                 page:
 *                   type: integer
 *                   description: Página atual
 *                 limit:
 *                   type: integer
 *                   description: Limite de itens por página
 *                 characters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Character'
 */
app.get("/characters", (req, res) => {
  let filteredCharacters = characters;

  // Filtra pelo nome
  if (req.query.name) {
    filteredCharacters = filteredCharacters.filter(character =>
      character.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }

  // Filtra pela fruta
  if (req.query.fruit) {
    filteredCharacters = filteredCharacters.filter(character =>
      character.fruit.name.toLowerCase().includes(req.query.fruit.toLowerCase())
    );
  }

  // Paginação
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const total = filteredCharacters.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex);

  res.json({
    total,
    page,
    limit,
    characters: paginatedCharacters
  });
});

/**
 * @openapi
 * /characters/{id}:
 *   get:
 *     summary: Obtém um personagem específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes do personagem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       404:
 *         description: Personagem não encontrado
 */
app.get("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const character = characters.find((c) => c.id === id);
  if (character) {
    res.json(character);
  } else {
    res.status(404).send("Personagem não encontrado");
  }
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         job:
 *           type: string
 *         height:
 *           type: string
 *         birthday:
 *           type: string
 *         age:
 *           type: string
 *         bounty:
 *           type: string
 *         status:
 *           type: string
 *         img:
 *           type: string
 *         fruit:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *             img:
 *               type: string
 *             name:
 *               type: string
 *             power:
 *               type: string
 *             type:
 *               type: string
 *         description:
 *           type: string
 */

// Inicie o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

(async () => {

// const connectionString = 'mongodb://localhost:27017/live_fabrica';
const connectionString = 'mongodb+srv://admin:keCmdEGOurJl5YXz@cluster0.o2szb.mongodb.net/live_fabrica?retryWrites=true&w=majority';

console.info('Conectando ao banco de dados MongoDB...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

/*
Lista de Endpoints da aplicação CRUD de mensagens
CRUD: Create, Read (Single & All), Update and Delete
CRUD: Criar, Ler (Individual e Tudo), Atualizar e Remover
- [GET] /mensagens - Retorna a lista de mensagens
- [GET] /mensagens/{id} - Retorna apenas uma única mensagem pelo ID
- [POST] /mensagens - Cria uma nova mensagem
- [PUT] /mensagens/{id} - Atualiza uma mensagem pelo ID
- [DELETE] /mensagens/{id} - Remover uma mensagem pelo ID
*/

const db = client.db('live_fabrica');
const mensagens = db.collection('mensagens');

const getMensagensValidas = () => mensagens.find({}).toArray();

const getMensagemById = async id => mensagens.findOne({ _id: ObjectId(id) });

// - [GET] /mensagens - Retorna a lista de mensagens
app.get('/mensagens', async (req, res) => {
    res.send(await getMensagensValidas());
});

// - [GET] /mensagens/{id} - Retorna apenas uma única mensagem pelo ID
app.get('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const mensagem = await getMensagemById(id);

    if (!mensagem) {
        res.send('Mensagem não encontrada.');

        return;
    }

    res.send(mensagem);
});

// - [POST] /mensagens - Cria uma nova mensagem
app.post('/mensagens', async (req, res) => {
    const mensagem = req.body;

    if (!mensagem
        || !mensagem.texto
        || !mensagem.usuario) {
        res.send('Mensagem inválida.');

        return;
    }

    const { insertedCount } = await mensagens.insertOne(mensagem);

    if (insertedCount !== 1) {
        res.send('Ocorreu um erro ao criar a mensagem.');

        return;
    }

    res.send(mensagem);
});

// - [PUT] /mensagens/{id} - Atualiza uma mensagem pelo ID
app.put('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const novaMensagem = req.body;

    if (!novaMensagem
        || !novaMensagem.texto
        || !novaMensagem.usuario) {
        res.send('Mensagem inválida.');

        return;
    }

    const quantidade_mensagens = await mensagens.countDocuments({ _id: ObjectId(id) });

    if (quantidade_mensagens !== 1) {
        res.send('Mensagem não encontrada.');

        return;
    }

    const { result } = await mensagens.updateOne(
        {
            _id: ObjectId(id)
        },
        {
            $set: novaMensagem
        }
    );

    if (result.ok !== 1) {
        res.send('Ocorreu um erro ao atualizar a mensagem.');

        return;
    }

    res.send(await getMensagemById(id));
});

// - [DELETE] /mensagens/{id} - Remover uma mensagem pelo ID
app.delete('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const quantidade_mensagens = await mensagens.countDocuments({ _id: ObjectId(id) });

    if (quantidade_mensagens !== 1) {
        res.send('Mensagem não encontrada.');

        return;
    }
    
    const { deletedCount } = await mensagens.deleteOne({ _id: ObjectId(id) });

    if (deletedCount !== 1) {
        res.send('Ocorreu um erro ao remover a mensagem.');

        return;
    }

    res.send('Mensagem removida com sucesso.');
});

app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`);
});

})();

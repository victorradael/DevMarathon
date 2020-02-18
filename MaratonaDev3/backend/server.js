const {name, password} = require('./cred.json')
const namDb = name;
const passDb = password;
//server config
const express = require('express');
const server = express();

//config conex DB
const { Pool } = require('pg');
const db = new Pool({
    user: namDb,
    password: passDb,
    host: 'localhost',
    port: 5432,
    database: 'doe',
});

//template eng config
const nunjucks = require('nunjucks');
nunjucks.configure('../frontend', {
    express: server,
    noCache: true,
});

//configure the server to display extra files
server.use(express.static('../frontend/public'));

// using body
server.use(express.urlencoded({ extended: true }));

// config pag func
server.get('/', (req, res) => {
    
    db. query("SELECT * FROM donors", (err, result) => {
        if(err) return res.send('Erro ao carregar o Banco de Dados.')

        const donors = result.rows
        return res.render('index.html', { donors })
    })
});


server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1,$2,$3)`

    const values = [name, email, blood];

    // add valors in db
    db.query(query, values, err => {
        if (err) return res.send('Erro no banco de dados.')

        return res.redirect('/');
    });
});


// turn ON server
server.listen(3000, _ => {
    console.log('Running Server')
});
const pool = require("../db")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const createUser = (req, res) => {
    let body = req.body;

    if (body) {
        bcrypt.hash(body.password, saltRounds, (err, hash) => {
        pool.query(`SELECT * FROM users WHERE name='${body.username}';`).then(results => {
            if (err) {
                console.log(err)
            }
            if (results.rowCount == 0) {
                pool.query(`INSERT INTO "users"("name", "password", "img") 
                    VALUES('${body.username}', '${hash}', '${body.img}') RETURNING id;`).then(results => {
                    res.status(200).json(results.rows[0].id);
                }).catch(error => {
                    res.status(500).json("Ocorreu um erro ao tentar criar o utilizador");
                    console.log(error);
                });

            } else {
                res.status(200).json("Já existe um utilizador com esse nome");
            }
        }).catch(error => {
            res.status(500).json("Ocorreu um erro ao tentar criar o utilizador");
            console.log(error);
        });

    })
    } else {
        res.status(400).json("Não existem dados para fazer a criação de um novo utilizador");
    }
}

const updateUser = (req, res) => {
    let body = req.body;
    let id = req.params.id;
    
    if (body) {
        bcrypt.hash(body.password, saltRounds, (err, hash) => {
        pool.query(`UPDATE users SET name = '${body.username}', password = '${hash}', img = '${body.img}' WHERE id='${id}'`).then(results => {
            if (err) {
                console.log(err)
            }
            if (results.rowCount == 1) {
                res.status(200).json("Utilizador Atualizado");
            } else {
                res.status(200).json("O utilizador já foi eliminado");
            }
        }).catch(error => {
            res.status(500).json("Ocorreu um erro ao tentar atualizar o utilizador");
            console.log(error);
        });
    })
    } else {
        res.status(400).json("Não existem dados para fazer a atualização do utilizador");
    }
}

const deleteUser = (req, res) => {
    let id = req.params.id;

    pool.query(`DELETE FROM users WHERE id='${id}';`).then(results => {
        if (results.rowCount == 1) {
            res.status(200).json("Utilizador Eliminado");
        } else {
            res.status(200).json("O utilizador já foi eliminado");
        }
    }).catch(error => {
        res.status(500).json("Ocorreu um erro ao tentar eliminar o utilizador");
        console.log(error);
    });
}


module.exports = {
    createUser,
    updateUser,
    deleteUser,
}

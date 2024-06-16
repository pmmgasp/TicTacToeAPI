const pool = require("../db")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const createUser = (req, res) => {
    let body = req.body;
    let username = body.username
    let password = body.password
    let img = body.img

    if (body) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
        pool.query(`SELECT * FROM users WHERE name = $1`, [username]).then(results => {
            if (err) {
                console.log(err)
            }
            if (results.rowCount == 0) {
                pool.query(`INSERT INTO users (name, password, img) VALUES ($1, $2, $3) RETURNING id`, 
                    [username, hash, img]).then(results => {
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
    let username = body.username
    let password = body.password
    let img = body.img
    
    if (body) {
        pool.query(`SELECT * FROM users WHERE name = $1 AND id != $2`, [username, id])
        .then(results => {
            if (results.rowCount > 0) {
                return res.status(200).json("O nome de utilizador já existe");
            }

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json("Erro ao encriptar a senha");
                }

                pool.query(`UPDATE users SET name = $1, password = $2, img = $3 WHERE id = $4`, 
                    [username, hash, img, id])
                    .then(updateResults => {
                        if (updateResults.rowCount == 1) {
                            res.status(200).json("Utilizador Atualizado");
                        } else {
                            res.status(200).json("O utilizador já foi eliminado");
                        }
                    })
                    .catch(error => {
                        res.status(500).json("Ocorreu um erro ao tentar atualizar o utilizador");
                        console.log(error);
                    });
            });
        })
        .catch(error => {
            res.status(500).json("Ocorreu um erro ao tentar verificar o nome de utilizador");
            console.log(error);
        });
    } else {
        res.status(400).json("Não existem dados para fazer a atualização do utilizador");
    }
}

const deleteUser = (req, res) => {
    let id = req.params.id;

    pool.query(`DELETE FROM users WHERE id = $1`, [id]).then(results => {
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

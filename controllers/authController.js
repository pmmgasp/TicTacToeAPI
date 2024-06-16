const pool = require("../db")
const bcrypt = require("bcrypt")

const login = (req, res) => {
    let body = req.body;
    let username = body.username
    let password = body.password
    
    pool.query(`SELECT * FROM users WHERE name = $1`, [username]).then(results => {
        //console.log(results.rows)
        if (results.rowCount === 0) {
            res.status(200).json("O nome de utilizador ou palavra-passe está incorreto");
        } else {
            bcrypt.compare(password, results.rows[0].password, (err, response) => {
            if (err) {
                console.log(err)
            }
            if (response) {
                res.status(200).json(`${results.rows[0].id};${results.rows[0].img}`);
            } else {
                res.status(200).json("O nome de utilizador ou palavra-passe está incorreto");
            }
        })
        }
    }).catch(error => {
        res.status(500).json({result: "Ocorreu um erro ao tentar obter o utilizador"});
        console.log(error);
    });
}


module.exports = {
    login,
}

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

Authorization = {
    async register(req, res) {
        
        let reqData = {
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            phone: req.body.phone,
            created: new Date(),
        }

        let chk = await runQuery(`SELECT * FROM users WHERE email = "${req.body.email}"`);
        if(!chk.status) return res.status(500).send('Error on the server.');
        if(chk.result.length > 0) {
            return res.status(404).send({status:false, message: 'User Already Available'});
        }
        
        //var sql2 = "INSERT INTO users SET ?";
        //var insertData = await runQuery(sql2, reqData);
        var insertData = await runQuery("INSERT INTO users SET ?", reqData);
        
        console.log(reqData);
        console.log(insertData);
        return res.status(200).send({status:true, message: 'User Registered Successfully'});
    },
    async login(req, res) {

        //User Verification
        let chk = await runQuery(`SELECT * FROM users WHERE email = "${req.body.email}"`);
        
        //Mysql Error
        if(!chk.status) return res.status(500).send({status:false, message:'Error on the server.'});
        
        if(!chk.result.length) return res.status(404).send({status:false, message: 'User Not available'});

        //Passwrod Verified
        var passwordIsValid = bcrypt.compareSync(req.body.password, chk.result[0].password);
        console.log("Password Verificatinon++++++++++++++++++", passwordIsValid);
        if (!passwordIsValid) return res.status(401).send({ status: false, message: "Username Or Password Is not valid" });

        let user = { id: chk.result[0].id, username: chk.result[0].username, email: chk.result[0].email, role: chk.result[0].role };

        // expires in 24 hours
        var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 86400 });
        //res.status(200).send({ auth: true, token: token });
        
        return res.status(200).send({status:true, message: 'Login Successful', response: { ...user, token: token }});
        
    },
    async verifyToken(req, res, next) {

        var token = req.headers['authorization'];

        if (!token)
          return res.status(403).send({ auth: false, message: 'No token provided.' });
          
        jwt.verify(token,  process.env.JWT_SECRET, function(err, decoded) {
          if (err)
          return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          
          // if everything good, save to request for use in other routes
          req.userId = decoded.id;
          next();
        });
    },
    async profile(req, res) {
        //User Verification
        let chk = await runQuery(`SELECT * FROM users WHERE id = ${req.userId}`);
        console.log(chk);
        //Mysql Error
        if(!chk.status) return res.status(500).send({status:false, message:'Error on the server.'});
        
        if(!chk.result.length) return res.status(404).send({status:false, message: 'User Not available'});

        return res.status(200).send({status:true, message: "chk 2"});
    }
}

module.exports = Authorization;
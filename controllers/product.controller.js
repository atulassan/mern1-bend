
Products = {
    async listProducts(req, res) {
        let products = await runQuery(`SELECT * FROM products`);
        if(!products.status) return res.status(500).send('Error on the server.');
        return res.status(200).send({status:true, data: products });
    },
    async getProduct(req, res) {
        let product = await runQuery(`SELECT * FROM products WHERE id = "${req.body.id}"`);
        if(!product.status) return res.status(500).send('Error on the server.');
        return res.status(200).send({status:true, data: product });
    },
    async createProduct(req, res) {
        
        let reqData = {
            sku: req.body.sku,
            name: req.body.name,
            category_id: req.body.category,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            created: new Date(),
        }

        var insertData = await runQuery("INSERT INTO products SET ?", reqData);

        if(!insertData.status) return res.status(500).send({status:false, message:'Error on the server.'});

        return res.status(200).send({status:true, message: 'Prouduct Added Successfully'});
    },
}

module.exports = Products;
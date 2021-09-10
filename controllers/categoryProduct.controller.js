
CategoryProduct = {
    async listCategories(req, res) {
        let categories = await runQuery(`SELECT * FROM categories WHERE type = 1`);
        if(!categories.status) return res.status(500).send('Error on the server.');
        return res.status(200).send({status:true, data: categories });
    },
    async createCategory(req, res) {
        
        let reqData = {
            name: req.body.name,
            description: req.body.description,
            type: 1,
            status: req.body.status,
            created: new Date(),
        }

        var insertData = await runQuery("INSERT INTO categories SET ?", reqData);

        if(!insertData.status) return res.status(500).send({status:false, message:'Error on the server.'});
        
        return res.status(200).send({status:true, message: 'Category Added Successfully'});
    },
}

module.exports = CategoryProduct;
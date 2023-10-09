const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://fijii360:D34LVrHPUYM1mDLH@cluster0.mlnprpp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);


exports.handler = async (event, context, callback) => {
    try {

        await client.connect();
        const database = await client.db('questionoftheday');
        const collection = await database.collection('qod');

        const query = { _id: "qod" };
        const result = await collection.findOne(query);

        return result.question;


    } catch (error) {
        return callback(error);
    } finally {
        await client.close();
    }

};
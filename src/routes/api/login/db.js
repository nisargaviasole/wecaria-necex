import {MongoClient} from 'mongodb';


const uri = 'mongodb+srv://mrjadhav721:nisarg0721@cluster0.8p7nmpb.mongodb.net/';
const client = new MongoClient(uri);

export async function connectDb() {
    try {
        await client.connect();
        console.log("Conected to the database");
        return client.db('wecaria-nacex');
    } catch (error) {
        console.log('Error connecting to the database', error);
        throw error;
    }
}
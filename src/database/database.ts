const {MongoClient} = require("mongodb");
function getClient(){
    const uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/?authMechanism=DEFAULT`;
    console.log(uri)
    return new MongoClient(uri);
}
export default getClient;
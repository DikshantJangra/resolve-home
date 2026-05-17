import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://fnow4554_db_user:urKfI709R0AtJN6r@cluster0.vnnygvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "electrical_plumbing_services";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to database");
    const db = client.db(dbName);
    const col = db.collection('user');
    
    // Find the user by email
    const user = await col.findOne({ email: "hodep72973@dardr.com" });
    console.log("=== RAW DB USER DOCUMENT ===");
    console.log(JSON.stringify(user, null, 2));

    // Also look up other users
    const allUsers = await col.find({}).limit(5).toArray();
    console.log("\n=== FIRST 5 USERS IN DB ===");
    console.log(JSON.stringify(allUsers.map(u => ({ id: u.id, _id: u._id, name: u.name, email: u.email, role: u.role, homeAddress: u.homeAddress })), null, 2));

  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await client.close();
  }
}

run();

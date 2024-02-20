// const { MongoClient, ServerApiVersion } = require('mongodb');
import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
    "mongodb+srv://admin:admin12345@cluster0.onhl1ub.mongodb.net/?retryWrites=true&w=majority";

let client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function run() {
    try {
        await client.connect();
        await client.db("Leds").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
        return true;
    } finally {
        await client.close();
    }
}

export async function getAllLeds() {
    try {
        await client.connect();
        let db = client.db("Leds");
        const Leds = await db
            .collection("Leds")
            .find({})
            .toArray((err, documents) => {
                if (err) {
                    console.error("Error finding documents:", err);
                    return;
                }

                console.log("Documents:", documents);

                client.close();
            });
        return Leds;
    } finally {
        await client.close();
    }
}

export async function getAllLedsNames() {
    try {
        await client.connect();
        let db = client.db("Leds");
        const Leds = await db
            .collection("Leds")
            .find({})
            .toArray((err, documents) => {
                if (err) {
                    console.error("Error finding documents:", err);
                    return;
                }
                client.close();
            });
        let names = Leds.map((i) => {
            return {
                name: i.name,
                id: i._id,
                tensorsCount: i.tensors.length,
            };
        });
        return names;
    } finally {
        await client.close();
    }
}
export async function addNewLed(data) {
    try {
        await client.connect();
        let db = client.db("Leds");
        const Leds = db.collection("Leds");
        let result = await Leds.insertOne(data);
        return result;
    } finally {
        client.close();
    }
}

export default client;

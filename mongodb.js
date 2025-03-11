import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const uri =
    "mongodb+srv://admin:admin12345@cluster0.onhl1ub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
                img: i.img
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

export async function addNewTensor(data) {
    try {
        let _id = data._id;
        let tensor = data.tensor;
        if (_id && tensor) {
            await client.connect();
            let db = client.db("Leds");
            const Leds = db.collection("Leds");
            const filter = { _id: new ObjectId(_id) };
            const update = {
                $push: {
                    tensors: tensor,
                },
            };
            const result = await Leds.updateOne(filter, update);
            return result;
        }
        return "";
    } catch (error) {
        console.error("Error updating document:", error);
        return error;
    } finally {
        if (client && client.topology && client.topology.isConnected()) {
            await client.close();
        }
    }
}

export async function getOneLed(_id) {
    try {
        await client.connect();
        let db = client.db("Leds");
        const Leds = db.collection("Leds");
        const filter = { _id: new ObjectId(_id) };
        let result = await Leds.findOne(filter);
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        return error;
    } finally {
        if (client && client.topology && client.topology.isConnected()) {
            await client.close();
        }
    }
}

export async function updateData(_id, data) {
    try {
        await client.connect();
        let db = client.db("Leds");
        const Leds = db.collection("Leds");
        const filter = { _id: new ObjectId(_id) };
        const update = {
            $set: {
                name: data.name,
                description: data.description,
                img: data.img
            },
        };
        const result = await Leds.updateOne(filter, update);
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        return error;
    } finally {
        if (client && client.topology && client.topology.isConnected()) {
            await client.close();
        }
    }
}


export default client;

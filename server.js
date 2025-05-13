const express = require('express');
const path = require('path')
const { connectToDatabase, getDb } = require('./db/mongo');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 5501;
const HOST = "0.0.0.0";

const addition = (n1, n2) => {
    return n1+n2;
}

const substraction = (n1, n2) => {
    return n1-n2;
}

const multiplication = (n1, n2) => {
    return n1 * n2;
}

const division = (n1, n2) => {
    return n1 / n2;
}

const exponential = (n1, n2) => {
    return n1 ** n2;
}

const modulo = (n1, n2) => {
    return n1 % n2;
}

app.use(express.static('public'));
app.use(express.json())

connectToDatabase().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server running at port:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});

app.post('/calculate', async (req, res) => {
    try{
        const {n1, n2, operations} = req.body;
        
        const number1 = parseFloat(n1);
        const number2 = parseFloat(n2);

        if (isNaN(number1)) {
            return res.status(400).json({ error: "Number 1 is incorrectly defined" });
        }
        if (isNaN(number2)) {
            return res.status(400).json({ error: "Number 2 is incorrectly defined" });
        }
        
        let result;

        if (operations == "Addition"){
            result = addition(number1, number2);
        } else if (operations == "Substraction") {
            result = substraction(number1, number2);
        } else if (operations == "Multiplication") {
            result = multiplication(number1, number2);
        } else if (operations == "Division") {
            if (n2 <= 0){
                return res.status(400).json({ error: "Number 2 must be bigger than zero for division" });
            }

            result = division(number1, number2);
        } else if (operations == "SquareRoot") {
            result = Math.sqrt(number1)
        } else if (operations == "Exponential") {
            result = exponential(number1, number2);
        } else if (operations == "Modulo") {
            result = modulo(number1, number2);
        }

        const db = getDb();
        await db.collection('calculations').insertOne({
            number1,
            number2,
            operation: operations,
            result,
            timestamp: new Date()
        });

        res.json({ result: result})
    }
    catch (err) 
    {
        console.log("An error has occurred ", err);
    }
})

//For read operation at `localhost:port/calculations`
app.get('/calculations', async (req, res) => {
    try {
        const db = getDb();
        const data = await db.collection('calculations').find().toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch calculations" });
    }
});

app.delete('/calculations/:id', async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;

        console.log("Server deleting document with ID: ", id)    

        const result = await db.collection('calculations').deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
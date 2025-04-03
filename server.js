const express = require('express');
const path = require('path')

const app = express();
const PORT = 5500;
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

app.post('/calculate', (req, res) => {
    try{
        const {n1, n2, operations} = req.body;
        
        const number1 = parseFloat(n1);
        const number2 = parseFloat(n2);

        if (isNaN(number1)){
            throw new Error("Number 1 is incorrectly defined");
        }
        if (isNaN(number2)){
            throw new Error("Number 2 is incorrectly defined");
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
                throw new Error("Number 2 must be bigger than zero for division");
            }

            result = division(number1, number2);
        } else if (operations == "SquareRoot") {
            result = Math.sqrt(number1)
        } else if (operations == "Exponential") {
            result = exponential(number1, number2);
        } else if (operations == "Modulo") {
            result = modulo(number1, number2);
        }

        res.json({ result: result})
    }
    catch (err) 
    {
        console.log("An error has occurred ", err);
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(PORT, HOST, () => {
    console.log(`Server running at port:${PORT}`)
})
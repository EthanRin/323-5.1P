document.getElementById("submit").addEventListener("click", async function() {
    console.log("Attempt calculation...")
    try {
        const n1 = document.getElementById('number1').value;
        const n2 = document.getElementById('number2').value;
        const operations = document.getElementById('operations').value;

        let response;

        if (operations == "SquareRoot"){
            response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ n1: n1, n2: 0, operations: operations})
            });
        } else {
            response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ n1: n1, n2: n2, operations: operations})
            });
        }

        console.log(n1, n2, operations);

        

        const data = await response.json();
        console.log("Server Response:", data);

        document.getElementById("result").value = parseFloat(data.result);
    
    } 
    catch (err) 
    {
        console.log("An error has occured ", err);
    }
})

document.getElementById("operations").addEventListener("change", function() {
    try {
        const n2 = document.getElementById('number2');
        const operations = document.getElementById('operations').value;

        if (operations === "SquareRoot"){
            n2.style.display = "none"
        } else {
            n2.style.display = "block"
        }
    } catch (err) {
        console.log("An error has occured ", err);
    }
})
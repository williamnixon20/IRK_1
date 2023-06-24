let express = require("express");
let cors = require("cors");
let path = require("path");
let { getHistory, saveHistory } = require("./db.js");
let {
    encodeRLE,
    decodeRLE,
    compress,
    decompress,
    decimalStringToBinaryString,
    binaryStringToDecimalString,
} = require("./lib.js");

let app = express();
let port = 3000;

let folder = path.join(__dirname, "..", "fe");
app.use(express.static(folder));

// Route handler for the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(folder, "index.html"));
});

// Enable CORS for all routes
app.use(cors());

// Parse JSON body
app.use(express.json());

app.get("/api/histories", (req, res) => {
    getHistory((histories) => {
        res.json(histories);
    });
});

// POST endpoint
app.post("/api/encode", (req, res) => {
    let { string, extra } = req.body;
    if (extra === "rle") {
        string = encodeRLE(string);
    }

    // Process the data or perform any required operations
    // For this example, we'll simply send back a response with the received data
    let compressed = compress(string).join(" ").trim();
    let result = {
        result: compressed,
        result_byte: decimalStringToBinaryString(compressed).trim(),
    };
    saveHistory(string, "encode", JSON.stringify(result));
    res.json(result);
});

app.post("/api/decode", (req, res) => {
    let { string, extra } = req.body;
    let arr = string.split(" ");

    if (arr[0].length === 8) {
        arr = binaryStringToDecimalString(string).trim().split(" ");
    }

    let result = decompress(arr);

    if (extra == "rle") {
        result = decodeRLE(result);
    }
    saveHistory(string, "decode", JSON.stringify(result));

    // Process the data or perform any required operations
    // For this example, we'll simply send back a response with the received data
    res.json({ result: result });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

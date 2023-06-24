"use strict";
let compress = (uncompressed) => {
    let i = 256,
        dictionary = {},
        c,
        wc,
        w = "",
        result = [],
        dictSize = 256;

    while (i--) dictionary[String.fromCharCode(i)] = i;

    for (i = 0; i < uncompressed.length; i++) {
        c = uncompressed.charAt(i);
        wc = w + c;
        //Do not use dictionary[wc] because javascript arrays
        //will return values for array['pop'], array['push'] etc
        // if (dictionary[wc]) {
        if (dictionary.hasOwnProperty(wc)) {
            w = wc;
        } else {
            result.push(dictionary[w]);
            // Add wc to the dictionary.
            dictionary[wc] = dictSize++;
            w = String(c);
        }
    }

    // Output the code for w.
    if (w !== "") result.push(dictionary[w]);

    return result;
};

let decompress = (compressed) => {
    console.log("DECOMPRES DPT " + compressed)
    let i,
        dictionary = [],
        w,
        result,
        k,
        entry = "",
        dictSize = 256;
    for (i = 0; i < 256; i += 1) {
        dictionary[i] = String.fromCharCode(i);
    }

    w = String.fromCharCode(compressed[0]);
    result = w;
    for (i = 1; i < compressed.length; i += 1) {
        console.log(result)
        console.log(compressed[i])
        k = compressed[i];
        if (dictionary[k]) {
            entry = dictionary[k];
        } else {
            if (k === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }

        result += entry;

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);

        w = entry;
    }
    return result;
}

function decimalStringToBinaryString(decimalString) {
    let decimalArray = decimalString.split(" "); // Split the decimal string by space
    let binaryString = "";

    // Iterate over each decimal value and convert it to binary representation
    for (let i = 0; i < decimalArray.length; i++) {
        let decimal = parseInt(decimalArray[i], 10); // Parse the decimal value

        if (!isNaN(decimal)) {
            // Convert decimal to binary and append it to the binary string
            let binary = decimal.toString(2);
            binaryString += binary.padStart(8, "0"); // Pad the binary value to 8 bits
            binaryString += " ";
        }
    }

    return binaryString;
}

function encodeRLE(str) {
    let encodedString = "";
    let count = 1;

    for (let i = 1; i <= str.length; i++) {
        if (i === str.length || str[i] !== str[i - 1]) {
            encodedString += count + str[i - 1];
            count = 1;
        } else {
            count++;
        }
    }

    return encodedString;
}

// Function to perform Run-Length Decoding (RLD)
function decodeRLE(encodedString) {
    let decodedString = "";

    for (let i = 0; i < encodedString.length; i += 2) {
        let count = parseInt(encodedString[i], 10);
        let char = encodedString[i + 1];

        decodedString += char.repeat(count);
    }

    return decodedString;
}

function binaryStringToDecimalString(binaryString) {
    let binaryArray = binaryString.split(" "); // Split the binary string by space
    let decimalString = "";

    // Iterate over each binary value and convert it to decimal representation
    for (let i = 0; i < binaryArray.length; i++) {
        let binary = binaryArray[i];

        // Convert binary to decimal and append it to the decimal string
        let decimal = parseInt(binary, 2);
        decimalString += decimal.toString() + " ";
    }

    return decimalString.trim(); // Remove trailing space and return the decimal string
}

module.exports = {
    encodeRLE,
    decodeRLE,
    compress,
    decompress,
    decimalStringToBinaryString,
    binaryStringToDecimalString,
};

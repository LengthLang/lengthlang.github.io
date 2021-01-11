var convert = document.getElementById("");
var string = document.getElementById("");
var output = document.getElementById("");

var console_log = (str) => {
    output.innerHTML += str + "\n";
    output.scrollTop = output.scrollHeight;
};

document.addEventListener("DOMContentLoaded", function() {
    convert = document.getElementById("convert");
    string = document.getElementById("string");
    output = document.getElementById("output");
    convert.addEventListener("click", function() {
        convert.setAttribute("disabled", true);
        string.setAttribute("readonly", true);
        output.innerHTML = "";
        convert_str(string.value, console_log);
        convert.removeAttribute("disabled");
        string.removeAttribute("readonly");
    });
});

var ignore = [13];
var push = "_".repeat(25);

var randchar = () => {
    var z = "abcdefghijklmnopqrstuvwxyz";
    z += z.toUpperCase() + "0123456789";
    return z.charAt(Math.floor(Math.random() * z.length));
};

var convert_str = (str, console_log) => {
    for (var x = 0; x < str.length; x++) {
        var z = str.charCodeAt(x);
        if (!ignore.includes(z)) {
            var out = (z / 5) | 0;
            console_log(randchar().repeat(25));
            console_log(randchar().repeat(out));
            console_log(randchar().repeat(25));
            console_log(randchar().repeat(5));
            console_log(randchar().repeat(20));
            console_log(randchar().repeat(25));
            console_log(randchar().repeat(z - (out * 5)));
            console_log(randchar().repeat(10));
            console_log(randchar().repeat(16));
        }
    }
};

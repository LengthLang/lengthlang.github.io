var code = document.getElementById("");
var stdout = document.getElementById("");
var run = document.getElementById("");
var debug_button = document.getElementById("");
var debug_text = document.getElementById("");

var code_running = false;
var is_inputting = false;
var input = "";
var input_end = null;

var console_log_replace = (str) => {
    stdout.innerHTML += str + "\n";
	stdout.scrollTop = stdout.scrollHeight;
};

var stdout_write_replace = (str) => {
    console.log(str);
    stdout.innerHTML += str;
	stdout.scrollTop = stdout.scrollHeight;
};

var input_ask_replace = (str, callback) => {
    is_inputting = true;
    stdout_write_replace(str);
    input_end = callback;
};

var exit_replace = (status = 0) => {
    if (!stdout.innerHTML.endsWith("\n") && stdout.innerHTML != "") console_log_replace("");
    console_log_replace("Exited with code " + status.toString());
    code_running = false;
    is_inputting = false;
    input = "";
    input_end = null;
    run.removeAttribute("disabled");
    debug_button.removeAttribute("disabled");
    debug_text.setAttribute("style", "");
    code.removeAttribute("readonly");
};

var console_error_replace = (message) => {
    console_log_replace("Error: " + message);
    exit_replace(1);
};

document.addEventListener("DOMContentLoaded", function() {
    code = document.getElementById("code");
    stdout = document.getElementById("stdout");
    run = document.getElementById("run");
    debug_button = document.getElementById("debug");
    debug_text = document.getElementById("debugtext");
    stdout.addEventListener("keydown", function(event) {
        if (event.code == "Escape") return exit_replace(1);
        else if (is_inputting) {
            if (event.code != "Enter") {
                input += event.key;
                stdout_write_replace(event.key);
            }
            else {
                console_log_replace("");
                var input_backup = input.charCodeAt(0);
                input = "";
                input_end(input_backup);
                input_end = null;
                is_inputting =  false;
            }
        }
    });
    run.addEventListener("click", function() {
        stdout.innerHTML = "";
        var parsed = [];
        code.value.split("\n").forEach(x => {
            parsed.push(x.length);
        });
        length_run_code([...parsed]);
    });
});

var length_run_code = (code_parsed) => {
    code_running = true;
    run.setAttribute("disabled", true);
    debug_button.setAttribute("disabled", true);
    debug_text.setAttribute("style", "color: lightgray;");
    code.setAttribute("readonly", true);
    check_x(-1, [], code_parsed, debug_button.checked, console_log_replace, stdout_write_replace, input_ask_replace, exit_replace, console_error_replace);
};

function run_commands(x, stack, program, debug, console_log, stdout_write, input_ask, exit_replace, stdout_error) {
    if (debug) console_log(x + 1);
    var is_input = false;
    switch (program[x]) {
        case 10:
            if (debug) console_log("add");
            if (stack.length < 2) stdout_error("Stack underflow at line " + x);
            var x1 = stack.pop();
            var x2 = stack.pop();
            stack.push(x1 + x2);
            break;
        case 11:
            if (debug) console_log("sub");
            if (stack.length < 2) stdout_error("Stack underflow at line " + x);
            var x1 = stack.pop();
            var x2 = stack.pop();
            stack.push(x2 - x1);
            break;
        case 20:
            if (debug) console_log("mul");
            if (stack.length < 2) stdout_error("Stack underflow at line " + x);
            var x1 = stack.pop();
            var x2 = stack.pop();
            stack.push(x1 * x2);
            break;
        case 21:
            if (debug) console_log("div");
            if (stack.length < 2) stdout_error("Stack underflow at line " + x);
            var x1 = stack.pop();
            var x2 = stack.pop();
            stack.push(x2 / x1);
            break;
        case 15:
            if (debug) console_log("outn::::::::::");
            if (stack.length < 1) stdout_error("Stack underflow at line " + x);
            stdout_write(stack.pop().toString());
            break;
        case 16:
            if (debug) console_log("outa:::::::::");
            if (stack.length < 1) stdout_error("Stack underflow at line " + x);
            stdout_write(String.fromCharCode(stack.pop()));
            break;
        case 25:
            if (debug) console_log("push");
            stack.push(program[x + 1]);
            x += 1;
            break;
        case 13:
            if (debug) console_log("cond");
            if (stack.length < 1) stdout_error("Stack underflow at line " + x);
            if (stack.pop() == 0) {
                x += 1;
                if ([14, 25].includes(program[x])) x += 1;
            }
            break;
        case 14:
            if (debug) console_log("gotou");
            x = program[x + 1] - 1;
            if (debug) console_log("pc = " + x);
            break;
        case 24:
            if (debug) console_log("gotos");
            if (stack.length < 1) stdout_error("Stack underflow at line " + x);
            x = stack.pop();
            if (debug) console_log("pc = " + x);
            break;
        case 9:
            is_input = true;
            input_ask("Input:\n", (z) => {
                stack.push(z);
                check_x(x, stack, program, debug, console_log, stdout_write, input_ask, exit_replace, stdout_error);
            });
            break;
        case 12:
            if (debug) console_log("dup");
            var z = stack.pop();
            stack.push(z);
            stack.push(z);
            break;
    }
    if (debug) console_log("----------\n" + JSON.stringify(stack));
    if (is_input == false) setTimeout(function() {
        check_x(x, stack, program, debug, console_log, stdout_write, input_ask, exit_replace, stdout_error);
    }, 0);
}

function check_x(x, stack, program, debug, console_log, stdout_write, input_ask, exit_replace, stdout_error) {
    x += 1;
    if (x < program.length && code_running) run_commands(x, stack, program, debug, console_log, stdout_write, input_ask, exit_replace, stdout_error);
    else if (code_running) exit_replace(0);
}

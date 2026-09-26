// =========================
// PASSWORD HISTORY
// =========================

let passwordHistory = [];


// =========================
// PASSWORD LENGTH
// =========================

function updateLength() {

    const length =
        document.getElementById("length").value;

    document.getElementById("lengthValue").textContent =
        length;
}


// =========================
// SECURE RANDOM CHARACTER
// =========================

function getSecureRandomIndex(max) {

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;
}


// =========================
// SHUFFLE PASSWORD
// =========================

function shufflePassword(passwordArray) {

    for (
        let i = passwordArray.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            getSecureRandomIndex(i + 1);

        [
            passwordArray[i],
            passwordArray[randomIndex]
        ] =
        [
            passwordArray[randomIndex],
            passwordArray[i]
        ];
    }

    return passwordArray.join("");
}


// =========================
// GENERATE PASSWORD
// =========================

function generatePassword() {

    const length =
        Number(
            document.getElementById("length").value
        );

    const uppercase =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lowercase =
        "abcdefghijklmnopqrstuvwxyz";

    const numbers =
        "0123456789";

    const symbols =
        "@#$%&*!";

    let characterGroups = [];

    let characters = "";


    if (
        document.getElementById("uppercase").checked
    ) {

        characterGroups.push(uppercase);

        characters += uppercase;
    }


    if (
        document.getElementById("lowercase").checked
    ) {

        characterGroups.push(lowercase);

        characters += lowercase;
    }


    if (
        document.getElementById("numbers").checked
    ) {

        characterGroups.push(numbers);

        characters += numbers;
    }


    if (
        document.getElementById("symbols").checked
    ) {

        characterGroups.push(symbols);

        characters += symbols;
    }


    if (
        characterGroups.length === 0
    ) {

        alert(
            "Please select at least one character type."
        );

        return;
    }


    if (
        length < characterGroups.length
    ) {

        alert(
            "Password length is too short for the selected options."
        );

        return;
    }


    let passwordArray = [];


    // Make sure every selected type is included

    for (
        const group of characterGroups
    ) {

        const randomIndex =
            getSecureRandomIndex(
                group.length
            );

        passwordArray.push(
            group[randomIndex]
        );
    }


    // Fill remaining characters

    while (
        passwordArray.length < length
    ) {

        const randomIndex =
            getSecureRandomIndex(
                characters.length
            );

        passwordArray.push(
            characters[randomIndex]
        );
    }


    // Shuffle password

    const password =
        shufflePassword(passwordArray);


    const passwordElement =
        document.getElementById("password");


    passwordElement.textContent =
        password;


    passwordElement.style.filter =
        "none";


    document.getElementById("showButton").textContent =
        "👁️";


    calculateStrength(
        length,
        characters.length
    );


    addToHistory(password);


    // Generation animation

    passwordElement.animate(
        [
            {
                opacity: 0,
                transform: "scale(0.95)"
            },

            {
                opacity: 1,
                transform: "scale(1)"
            }
        ],

        {
            duration: 300,
            easing: "ease-out"
        }
    );
}


// =========================
// PASSWORD STRENGTH
// =========================

function calculateStrength(
    length,
    characterCount
) {

    let strength = "Weak";

    let percentage = 30;


    if (
        length >= 16 &&
        characterCount >= 70
    ) {

        strength = "Very Strong";

        percentage = 100;

    }

    else if (
        length >= 12 &&
        characterCount >= 60
    ) {

        strength = "Strong";

        percentage = 85;

    }

    else if (
        length >= 8 &&
        characterCount >= 40
    ) {

        strength = "Medium";

        percentage = 60;
    }


    document.getElementById("strength").textContent =
        "Password Strength: " + strength;


    document.getElementById("strengthFill").style.width =
        percentage + "%";
}


// =========================
// SHOW / HIDE PASSWORD
// =========================

function togglePassword() {

    const password =
        document.getElementById("password");

    const showButton =
        document.getElementById("showButton");


    if (
        password.textContent === "" ||
        password.textContent ===
        "Your password will appear here"
    ) {

        return;
    }


    if (
        password.style.filter ===
        "blur(5px)"
    ) {

        password.style.filter =
            "none";

        showButton.textContent =
            "👁️";

    }

    else {

        password.style.filter =
            "blur(5px)";

        showButton.textContent =
            "👁️‍🗨️";
    }
}


// =========================
// COPY PASSWORD
// =========================

function copyPassword() {

    const password =
        document.getElementById("password").textContent;


    if (
        password === "" ||
        password ===
        "Your password will appear here"
    ) {

        alert(
            "First generate a password!"
        );

        return;
    }


    navigator.clipboard
        .writeText(password)

        .then(function () {

            const copyButton =
                document.getElementById("copyButton");


            copyButton.textContent =
                "Copied ✓";


            setTimeout(function () {

                copyButton.textContent =
                    "Copy";

            }, 2000);

        })

        .catch(function () {

            alert(
                "Unable to copy password."
            );
        });
}


// =========================
// ADD PASSWORD TO HISTORY
// =========================

function addToHistory(password) {

    passwordHistory.unshift(password);


    // Keep only last 5 passwords

    if (
        passwordHistory.length > 5
    ) {

        passwordHistory.pop();
    }


    displayHistory();
}


// =========================
// DISPLAY HISTORY
// =========================

function displayHistory() {

    const historyList =
        document.getElementById("historyList");


    historyList.innerHTML = "";


    if (
        passwordHistory.length === 0
    ) {

        historyList.innerHTML =
            '<p class="empty-history">No passwords generated yet.</p>';

        return;
    }


    passwordHistory.forEach(
        function (password) {

            const item =
                document.createElement("div");

            item.className =
                "history-item";


            const passwordText =
                document.createElement("span");

            passwordText.className =
                "history-password";

            passwordText.textContent =
                password;


            const copyButton =
                document.createElement("button");

            copyButton.className =
                "history-copy";

            copyButton.textContent =
                "Copy";


            copyButton.onclick =
                function () {

                    navigator.clipboard
                        .writeText(password)

                        .then(function () {

                            copyButton.textContent =
                                "Copied ✓";


                            setTimeout(
                                function () {

                                    copyButton.textContent =
                                        "Copy";

                                },

                                1500
                            );

                        });
                };


            item.appendChild(passwordText);

            item.appendChild(copyButton);

            historyList.appendChild(item);

        }
    );
}


// =========================
// CLEAR HISTORY
// =========================

function clearHistory() {

    passwordHistory = [];

    displayHistory();
}


// =========================
// CLEAR CURRENT PASSWORD
// =========================

function clearPassword() {

    const password =
        document.getElementById("password");


    password.textContent =
        "Your password will appear here";


    password.style.filter =
        "none";


    document.getElementById("strength").textContent =
        "Password Strength: -";


    document.getElementById("strengthFill").style.width =
        "0%";


    document.getElementById("copyButton").textContent =
        "Copy";


    document.getElementById("showButton").textContent =
        "👁️";
}


// =========================
// DARK / LIGHT MODE
// =========================

function toggleTheme() {

    const body =
        document.body;

    const container =
        document.querySelector(".container");

    const themeButton =
        document.getElementById("themeButton");


    // Toggle dark mode class

    const isDark =
        body.classList.toggle("dark-mode");


    if (isDark) {

        // DARK MODE

        body.style.background =
            "linear-gradient(135deg, #020617, #0f172a, #1e1b4b)";


        container.style.background =
            "#111827";


        container.style.color =
            "#f8fafc";


        themeButton.textContent =
            "☀️";


        themeButton.title =
            "Switch to Light Mode";

    }

    else {

        // LIGHT MODE

        body.style.background =
            "linear-gradient(135deg, #0f172a, #1e3a8a, #312e81)";


        container.style.background =
            "#ffffff";


        container.style.color =
            "#111827";


        themeButton.textContent =
            "🌙";


        themeButton.title =
            "Switch to Dark Mode";
    }
}


// =========================
// INITIAL THEME
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const themeButton =
            document.getElementById("themeButton");


        if (themeButton) {

            themeButton.textContent =
                "🌙";


            themeButton.title =
                "Switch to Dark Mode";
        }
    }
);
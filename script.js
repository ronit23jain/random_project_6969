document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }

        message.textContent =
            `Registration successful! Welcome, ${name}.`;

        message.style.color = "green";

        console.log("Registered User:");
        console.log("Name:", name);
        console.log("Email:", email);
    });
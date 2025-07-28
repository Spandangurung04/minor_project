document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email) {
        alert('Please enter your email.');
        return;
    }
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!password) {
        alert('Please enter your password.');
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('hamroUser'));

    if (storedUser && email === storedUser.email && password === storedUser.password) {
        alert("Login Successful");
        window.location.href = "homepage.html";  // Redirect to homepage
    } else {
        alert("Invalid credentials. Try again.");
    }
});

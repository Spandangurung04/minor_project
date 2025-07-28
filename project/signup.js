document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!name) {
        alert('Please enter your name.');
        return;
    }
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
        alert('Please enter a password.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // For demo: store in localStorage
    localStorage.setItem('hamroUser', JSON.stringify({
        name: name,
        email: email,
        password: password
    }));

    alert("Signup successful! Please login.");
    window.location.href = "login.html"; // Redirect to login page
});

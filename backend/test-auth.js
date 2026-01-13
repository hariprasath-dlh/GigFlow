// Using global fetch (Node 18+)
// Actually, let's assume Node 18+ has global fetch. If not, we might need to install node-fetch or use http module.
// Given constraints, I'll use http module to be safe and dependency-free for this script, or just try fetch.
// Let's try native fetch first, falling back to basic checks.

async function testAuth() {
    const baseUrl = 'http://localhost:5001/api/auth';
    const user = {
        name: 'Verification User',
        email: `verify_${Date.now()}@example.com`,
        password: 'securepassword'
    };

    console.log('--- Starting Auth Verification ---');

    // 1. Register
    try {
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const regData = await regRes.json();
        console.log(`Register Status: ${regRes.status}`);
        console.log('Register Response:', regData);

        // Extract cookie
        const cookies = regRes.headers.get('set-cookie');
        console.log('Cookies received:', cookies ? 'YES' : 'NO');

        if (regRes.status !== 201) throw new Error('Registration failed');

        // 2. Login
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        const loginData = await loginRes.json();
        console.log(`Login Status: ${loginRes.status}`);
        console.log('Login Response:', loginData);

        const loginCookies = loginRes.headers.get('set-cookie');
        const jwtCookie = loginCookies ? loginCookies.split(';')[0] : null;

        if (loginRes.status !== 200) throw new Error('Login failed');

        // 3. Protected Route
        const meRes = await fetch(`${baseUrl}/me`, {
            method: 'GET',
            headers: {
                'Cookie': jwtCookie
            }
        });
        const meData = await meRes.json();
        console.log(`Protected Route Status: ${meRes.status}`);
        console.log('Protected Route Response:', meData);

        if (meRes.status === 200 && meData.email === user.email) {
            console.log('>>> VERIFICATION SUCCESSFUL <<<');
        } else {
            console.log('>>> VERIFICATION FAILED <<<');
        }

    } catch (error) {
        console.error('Verification Error:', error);
    }
}

testAuth();

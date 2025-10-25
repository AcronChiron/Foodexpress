// Test JavaScript Fetch API example from documentation

// Login function
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  console.log('Login response status:', response.status);
  console.log('Response data keys:', Object.keys(data));
  return data.data.token;
};

// Get user profile function
const getUserProfile = async (token, userId) => {
  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log('User profile status:', response.status);
  console.log('User data keys:', Object.keys(data.data));
  return data;
};

// Test the functions
(async () => {
  try {
    const token = await login('test@example.com', 'password123');
    console.log('Token obtained:', token.substring(0, 20) + '...');
    const userData = await getUserProfile(token, '68fd2a17315d6857cd99302b');
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();

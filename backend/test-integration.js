const axios = require("axios")
const fs = require("fs")
const path = require("path")
const FormData = require("form-data")

// Configuration
const API_URL = "http://localhost:5000/api"
const TEST_USER = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  role: "jobSeeker",
}

// Test functions
async function testRegister() {
  try {
    console.log("Testing user registration...")
    const response = await axios.post(`${API_URL}/auth/register`, TEST_USER)
    console.log("Registration successful:", response.data.success)
    return response.data.data
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.message.includes("already exists")) {
      console.log("User already exists, trying login instead...")
      return testLogin()
    }
    console.error("Registration failed:", error.response?.data || error.message)
    throw error
  }
}

async function testLogin() {
  try {
    console.log("Testing user login...")
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    console.log("Login successful:", response.data.success)
    return response.data.data
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message)
    throw error
  }
}

async function testGetProfile(token) {
  try {
    console.log("Testing get user profile...")
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log("Get profile successful:", response.data.success)
    return response.data.data
  } catch (error) {
    console.error("Get profile failed:", error.response?.data || error.message)
    throw error
  }
}

async function testUploadCV(token) {
  try {
    console.log("Testing CV upload...")

    // Create a test image if it doesn't exist
    const testImagePath = path.join(__dirname, "test-cv.png")
    if (!fs.existsSync(testImagePath)) {
      // Create a simple test image (1x1 pixel transparent PNG)
      const buffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      )
      fs.writeFileSync(testImagePath, buffer)
    }

    // Create form data
    const formData = new FormData()
    formData.append("image", fs.createReadStream(testImagePath))
    formData.append("title", "Test CV")

    // Upload CV
    const response = await axios.post(`${API_URL}/cv/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    })

    console.log("CV upload successful:", response.data.success)
    return response.data.data
  } catch (error) {
    console.error("CV upload failed:", error.response?.data || error.message)
    throw error
  }
}

async function testGetCVs(token) {
  try {
    console.log("Testing get user CVs...")
    const response = await axios.get(`${API_URL}/cv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log("Get CVs successful:", response.data.success)
    console.log(`Found ${response.data.count} CVs`)
    return response.data.data
  } catch (error) {
    console.error("Get CVs failed:", error.response?.data || error.message)
    throw error
  }
}

// Run all tests
async function runTests() {
  try {
    // Register or login
    const user = await testRegister()

    // Get profile
    await testGetProfile(user.token)

    // Upload CV
    await testUploadCV(user.token)

    // Get CVs
    await testGetCVs(user.token)

    console.log("\n✅ All tests passed! Frontend and backend are properly integrated.")
  } catch (error) {
    console.error("\n❌ Tests failed. Please check the error messages above.")
    process.exit(1)
  }
}

// Run the tests
runTests()


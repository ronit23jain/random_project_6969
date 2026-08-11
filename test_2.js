const fs = require('fs');

console.log("--- Running Basic Jenkins Test Suite ---\n");

let passed = true;

// Test 1: Check if students.json exists
if (fs.existsSync('students.json')) {
    console.log("[PASS] students.json file exists");
} else {
    console.error("[FAIL] students.json file does not exist");
    process.exit(1);
}

// Test 2: Check if index.html exists
if (fs.existsSync('index.html')) {
    console.log("[PASS] index.html file exists");
} else {
    console.error("[FAIL] index.html file does not exist");
    process.exit(1);
}

// Test 3: Check if script.js exists
if (fs.existsSync('script.js')) {
    console.log("[PASS] script.js file exists");
} else {
    console.error("[FAIL] script.js file does not exist");
    process.exit(1);
}

// Test 4: Check if style.css exists
if (fs.existsSync('style.css')) {
    console.log("[PASS] style.css file exists");
} else {
    console.error("[FAIL] style.css file does not exist");
    process.exit(1);
}

// Test 5: Name Validation 
if (student.name.trim() !== "") {
    console.log("TC-05 : Name Validation : Pass");
} else {
    console.error("TC-05 : Name Validation : FAIL");
    passed = false;
}

// Test 6: Email Validation
if (student.email.includes("@")) {
    console.log("TC-06 : Email Validation : Pass");
} else {
    console.error("[FAIL] Email validation failed");
    passed = false;
}

// Test 7: Mobile Validation 
if (student.mobile.length === 10) {
    console.log("TC-07 : Mobile Validation : Pass");
} else {
    console.error("TC-07 : Mobile Validation : FAIL");
    passed = false;
}

// Test 8 : Branch Validation 
if (student.branch !== "") {
    console.log("TC-08 : Branch Validation : Pass");
} else {
    console.error("[FAIL] Branch validation failed");
    passed = false;
}

// Test 9 : password Validation 
if (student.password.length >= 6) {
    console.log("TC-09 : Password Validation : Pass");
} else {
    console.log("TC-09: password validation : Fail");
    passed = false;
}

// Test 10: Registration Successful
if (student.name && student.email && student.regNumber) {
    console.log("TC-10 : Registration Successful : Pass");
} else {
    console.error("TC-10 : Registration Successful : FAIL");
    passed = false;
}

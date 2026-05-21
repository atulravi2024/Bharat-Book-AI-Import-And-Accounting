/**
 * Bharat Book AI - Staff Contact JS Injection Script
 * 
 * Instructions:
 * 1. Open your browser console (F12 or Right Click -> Inspect -> Console).
 * 2. Paste this code block and press Enter while on the "Contacts -> Staff" tab with the "Add Contact" / "Add Staff" modal already open.
 * 3. It will automatically pre-fill Name, generate Code, select Department, select Designation, select Gender, and trigger React's internal update loops perfectly.
 */

(() => {
  console.log("🚀 Initializing Bharat Book AI Staff Injection Script...");

  // Select form fields by their unique DOM IDs
  const els = {
    name: document.getElementById('contact-name'),
    code: document.getElementById('contact-code'),
    department: document.getElementById('staff-department'),
    designation: document.getElementById('staff-designation'),
    gender: document.getElementById('staff-gender'),
    email: document.getElementById('staff-email'),
    phone: document.getElementById('staff-phone')
  };

  // Security guard check
  if (!els.name || !els.code) {
    console.error("❌ Error: Verification failed. Could not find 'contact-name' or 'contact-code' input fields on the page. Please ensure the 'Add Staff' or 'Add Contact' modal is active.");
    alert("❌ Please open the 'Add Contact' or 'Add Staff' modal first before injecting this script!");
    return;
  }

  // Custom helper function to trigger reactivity in React 16/17/18 state listeners
  function triggerReactInput(element, value) {
    if (!element) return;
    const lastValue = element.value;
    element.value = value;
    const event = new Event('input', { bubbles: true });
    // React's internal tracker bypass
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }

  function triggerReactSelect(element, value) {
    if (!element) return;
    element.value = value;
    const event = new Event('change', { bubbles: true });
    element.dispatchEvent(event);
  }

  // Pool of sample staff details for injection
  const staffPool = [
    { name: "Arjun Mehta", department: "Information Technology", designation: "Principal System & DevOps Engineer", gender: "Male", email: "arjun.devops@bharatbook.com" },
    { name: "Kavita Rao", department: "Finance", designation: "Finance & Taxation Manager", gender: "Female", email: "kavita.finance@bharatbook.com" },
    { name: "Siddharth Nair", department: "Management", designation: "General Manager & Operations Director", gender: "Male", email: "siddharth.manager@bharatbook.com" },
    { name: "Diya Sen", department: "Marketing & Ad", designation: "Lead Digital Advertiser & Brand Strategist", gender: "Female", email: "diya.advertiser@bharatbook.com" },
    { name: "Rohan Advani", department: "Publishing", designation: "Publisher Relations Specialist", gender: "Male", email: "rohan.relations@bharatbook.com" }
  ];

  const selectedStaff = staffPool[Math.floor(Math.random() * staffPool.length)];

  // 1. Automatically populate Name
  triggerReactInput(els.name, selectedStaff.name);
  console.log(`✅ Set Name: "${selectedStaff.name}"`);

  // 2. Automatically select Department
  triggerReactSelect(els.department, selectedStaff.department);
  console.log(`✅ Set Department: "${selectedStaff.department}"`);

  // Allow a tiny delay (50ms) for the Designation dropdown to update its dynamic selections based on selected Department
  setTimeout(() => {
    // 3. Automatically select Designation
    triggerReactSelect(els.designation, selectedStaff.designation);
    console.log(`✅ Set Designation: "${selectedStaff.designation}"`);

    // 4. Code Autogeneration Verification
    // The React application automatically generates the sequential, department-based code 
    // dynamically when the Department is selected, so we let React handle the generation and log it.
    console.log(`✅ React Auto-Generated Code in Form: "${els.code.value}"`);

    // 5. Automatically select Gender dropdown options
    triggerReactSelect(els.gender, selectedStaff.gender);
    console.log(`✅ Set Gender Dropdown: "${selectedStaff.gender}"`);

    // 6. Populate additional optional details
    if (els.email) {
      triggerReactInput(els.email, selectedStaff.email);
      console.log(`✅ Set Email: "${selectedStaff.email}"`);
    }

    if (els.phone) {
      const generatedPhone = "98" + Math.floor(10000000 + Math.random() * 90000000);
      triggerReactInput(els.phone, generatedPhone);
      console.log(`✅ Set Phone: "${generatedPhone}"`);
    }

    console.log("🎉 JS Field injection completed successfully! All React states are fully synchronized.");
  }, 100);

})();

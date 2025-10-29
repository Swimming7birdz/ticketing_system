import Cookies from "js-cookie"; 
import Papa from "papaparse";

const baseURL = process.env.REACT_APP_API_BASE_URL; 
const REQUIRED_HEADERS = [
  "name", 
  "canvas_user_id", 
  "user_id", 
  "login_id", 
  "sections", 
  "group_name", 
  "canvas_group_id", 
  "sponsor"
];

const addStudent = async (name, email, password) => { //will need to add more parameters
  try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email, //unique
        password: password, //unique
        role: "student",  
      }),
    });

    const responseData = await response.json();
    console.log(responseData)

    if (!response.ok) {
      return { success: false, error: `Account Creation Failed for ${name}: ${responseData?.message || response.statusText}` };
    }

    //also need to make student_data entry... another api
    return { success: true, data: responseData };

  } catch (error) {
    console.error("An error occurred during registration:", error);
      return { success: false, error: `Account Creation Failed for ${name}: ${error.message}` };
  }  
};

const generateRandomPassword = (length = 6) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const rnd = new Uint32Array(length);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(rnd);
  } else {
    for (let i = 0; i < length; i++) rnd[i] = Math.floor(Math.random() * 2 ** 32);
  }
  return Array.from(rnd, (n) => charset[n % charset.length]).join("");
};

const createStudent = async (row) => {
  const userData = {};
  REQUIRED_HEADERS.forEach((k) => {
    userData[k] = (row[k] ?? "").toString().trim();
  });

  const email = `${userData.login_id}@asu.edu`;
  const password = generateRandomPassword(6);

  // single awaited call only
  const result = await addStudent(userData.name, email, password);
  return result;
};

export const generateStudentUsers = (file) => {
    return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          quoteChar: '"',         
          escapeChar: '"',        
          delimiter: ',',         
          encoding: "UTF-8",
          newline: "\r\n",
          transformHeader: (h) => h.trim(),
          transform: (value) => value.trim(),
          complete: (results) => {
            const rows = results.data || [];
            // create all users in parallel and wait for all results
            const createPromises = rows.map((row) => createStudent(row));
            Promise.all(createPromises)
              .then((results) => {
                const errors = results
                  .map((r, i) => ({ r, i }))
                  .filter(x => !x.r.success)
                  .map(x => `Row ${x.i + 2}: ${x.r.error}`);
                resolve({ valid: errors.length === 0, errors, rows });
              })
              .catch((err) => {
                resolve({ valid: false, errors: [String(err)], rows });
              });
          },
          error: (err) => {
            resolve({ valid: false, errors: [String(err)], rows: [] });
          },
        });
    });

};
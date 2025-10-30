import Cookies from "js-cookie"; 
import Papa from "papaparse";
import {generateRandomPassword} from "../generateRandomPass";

const baseURL = process.env.REACT_APP_API_BASE_URL; 
const REQUIRED_HEADERS = [
  "project", 
  "sponsor", 
  "sponsor_email", 
  "instructor", 
  "instructor_email"
]; 

const checkUserExistsByEmail = async (email) => {
  try {
    const token = Cookies.get("token");
    const resp = await fetch(`${baseURL}/api/users/email/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log('checkUserExistsByEmail response status:', resp.status);

    if (resp.status === 200) {
      const data = await resp.json();
      //console.log('User exists with data:', data);
      return { exists: true, data };
    }

    if (resp.status === 404){
        //console.log('failed check');
        return { exists: false };
    } 
    
    const err = await resp.json().catch(() => ({}));
    //console.log('Unexpected response during email check:', err);
    return { exists: false, error: err?.message || resp.statusText };
  
} catch (error) {
    //console.error("Error checking user existence by email:", error);
    return { exists: false, error: error.message };
  }
};

const addTA  = async (name, email, password) => { //add paramaters
  try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: "TA",  
      }),
    });

    const responseData = await response.json();
    //console.log(responseData)

    if (!response.ok) {
      return { success: false, error: `Account Creation Failed for ${name}: ${responseData?.message || response.statusText}` };
    }

    return { success: true, data: responseData };

  } catch (error) {
    console.error("An error occurred during registration:", error);
      return { success: false, error: `Account Creation Failed for ${name}: ${error.message}` };
  }  
};

const createTAs = async (row) => {
    try {
        const userData = {};
        REQUIRED_HEADERS.forEach((k) => {
            userData[k] = (row[k] ?? "").toString().trim();
        });

        const email = userData.instructor_email;
        if (!email) return { success: false, error: "Missing instructor_email" };

        const exists = await checkUserExistsByEmail(email);
        
        if (exists.error) return { success: false, error: `Email check failed: ${exists.error}` };
        if (exists.exists) return { success: true, exists: true, data: exists.data };


        const password = generateRandomPassword();
        const result = await addTA(userData.instructor, email, password);
        //TO-DO: email TA with reset link?

        // treat unique-constraint responses as "already exists"
        if (!result.success && result.error && /duplicate|already exists|unique/i.test(result.error)) {
            return { success: true, exists: true };
        }

        return result;
  } catch (err) {
        return { success: false, error: err.message || String(err) };
  }
};

export const generateTAs = (file) => {
    return new Promise((resolve) => {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              quoteChar: '"',         
              escapeChar: '"',        
              delimiter: ',',         
              encoding: "UTF-8",
              newline: "\r\n",
            transformHeader: (h) =>
              (h || "")
                .replace(/^\uFEFF/, "")      // remove BOM
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "_")       // spaces -> underscore
                .replace(/[^\w_]/g, ""),    // remove other punctuation
            transform: (value) => (typeof value === "string" ? value.trim() : value),
              complete: (results) => {
                //console.log("Parsed data:", results.data);
                const rows = results.data || [];
                // create all users in parallel and wait for all results
                const createPromises = rows.map((row) => createTAs(row));
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
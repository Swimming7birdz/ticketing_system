import Cookies from "js-cookie"; 
import Papa from "papaparse";
import { generateRandomPassword }  from "../generateRandomPass";

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

//TO-DO: put this in its own file?
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

    if (resp.status === 200) {
      const data = await resp.json();
      return { exists: true, data };
    }

    if (resp.status === 404){
        return { exists: false };
    } 
    
    const err = await resp.json().catch(() => ({}));
    return { exists: false, error: err?.message || resp.statusText };
  
} catch (error) {
    return { exists: false, error: error.message };
  }
};

//TO-DO: migrate team to make team_name unique? 
const getTeam = async (name) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/teams/name/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    //console.log(responseData);

    if (response.ok) {
        return { success: true, data: responseData.team_id };
    } else {
        return { success: false, error: `Failed to fetch Team ID for name ${name}: ${responseData?.message || response.statusText}` };
    }
  } catch (error) {
      console.error("An error occurred while fetching Team ID:", error);
      return { success: false, error: `Failed to fetch Team ID for email ${email}: ${error.message}` };
  }
};


const addStudent = async (name, email, password, section, team_id) => {
  try {
    const token = Cookies.get("token");
    //create user account for student
    const responseUser = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email, 
        password: password, 
        role: "student",  
      }),
    });

    const responseUserData = await responseUser.json();
    //console.log(responseUserData)

    if (!responseUser.ok) {
      return { success: false, error: `User Creation Failed for ${name}: ${responseUserData?.message || responseUser.statusText}` };
    }

    const { user_id } = responseUserData;
    //console.log("Creating user with ID:", user_id, team_id, section);

    //now create student data based on new student user
    const responseStudentData = await fetch(`${baseURL}/api/studentdata/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
          user_id: user_id,
          team_id: team_id,
          section: section, 
      }),
    });

    if (!responseStudentData.ok) {
      const responseStudentDataError = await responseStudentData.json();
      return { success: false, error: `Student Data Creation Failed for ${name}: ${responseStudentDataError?.message || responseStudentData.statusText}` };
    }


    return { success: true, data: responseUser };

  } catch (error) {
    console.error("An error occurred during registration:", error);
      return { success: false, error: `Student account Failed for ${name}: ${error.message}` };
  }  
};


const createStudent = async (row) => {
  const userData = {};
  REQUIRED_HEADERS.forEach((k) => {
    userData[k] = (row[k] ?? "").toString().trim();
  });

  const email = `${userData.login_id}@asu.edu`;;
  if (!email) return { success: false, error: "Missing email" };

  const exists = await checkUserExistsByEmail(email);
  
  if (exists.error) return { success: false, error: `Email check failed: ${exists.error}` };
  if (exists.exists) return { success: true, exists: true, data: exists.data };
  //TO-DO: notify user if student already exists?

  //console.log(exists)

  const name = (userData.name ?? "").replace(/,/g, "").trim();
  const password = generateRandomPassword();
  const section = userData.sections;
  const team_id = await getTeam(userData.group_name);

  //TO-DO: add entry to teammembers table?
  const result = await addStudent(name, email, password, section, team_id.data);
  //TO-DO: email student with reset link?
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
            //console.log("Parsed data:", results.data);
            const rows = results.data || [];
            const createPromises = rows.map((row) => createStudent(row)); // create all users in parallel and wait for all results
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
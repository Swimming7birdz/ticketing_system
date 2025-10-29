import Cookies from "js-cookie"; 
import Papa from "papaparse";

const baseURL = process.env.REACT_APP_API_BASE_URL; 
const REQUIRED_HEADERS = [
  "project", 
  "sponsor", 
  "sponsor_email", 
  "instructor", 
  "instructor_email"
]; 

const checkTeamExists = async (name) => {
  try {
    const token = Cookies.get("token");
    const resp = await fetch(`${baseURL}/api/teams/name/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

const getTaIDByEmail = async (email) => {
    try {
        const token = Cookies.get("token");
        const response = await fetch(`${baseURL}/api/users/email/${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        //console.log(responseData);

        if (response.ok) {
            return { success: true, data: responseData.user_id };
        } else {
            return { success: false, error: `Failed to fetch TA ID for email ${email}: ${responseData?.message || response.statusText}` };
        }
    } catch (error) {
        console.error("An error occurred while fetching TA ID:", error);
        return { success: false, error: `Failed to fetch TA ID for email ${email}: ${error.message}` };
    }
};

const addTeam = async (project, sponsor, sponsor_email, taID) => { //add paramaters
    try {
        const token = Cookies.get("token");
        const response = await fetch(`${baseURL}/api/teams/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            team_name: project,
            instructor_user_id: taID,
            sponsor_name: sponsor,
            sponsor_email: sponsor_email,
          }),
        });

        const responseData = await response.json();
        //console.log(responseData)

        if (!response.ok) {
        return { success: false, error: `Team Creation Failed for ${name}: ${responseData?.message || response.statusText}` };
        }

        return { success: true, data: responseData };

    } catch (error) {
        console.error("An error occurred during registration:", error);
        return { success: false, error: `Team Creation Failed for ${name}: ${error.message}` };
    }
};

const createTeams = async (row) => {
    const userData = {};
    REQUIRED_HEADERS.forEach((k) => {
        userData[k] = (row[k] ?? "").toString().trim();
    });

    const team_name = userData.project;
    if (!team_name) return { success: false, error: "Missing team name" };

    const exists = await checkTeamExists(team_name);
    
    if (exists.error) return { success: false, error: `Team check failed: ${exists.error}` };
    if (exists.exists) return { success: true, exists: true, data: exists.data };

  const taID = await getTaIDByEmail(userData.instructor_email);
    //console.log(taID.data);
    if (!taID.success) {
        return { success: false, error: `Could not find TA with email ${userData.instructor_email}: ${taID.error}` };
    }
    const result = await addTeam(userData.project, userData.sponsor, userData.sponsor_email, taID.data);
    return result;
};

export const generateTeams = (file) => {
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
                const rows = results.data || [];
                // create all users in parallel and wait for all results
                const createPromises = rows.map((row) => createTeams(row));
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

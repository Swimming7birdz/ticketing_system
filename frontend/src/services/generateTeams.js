import Cookies from "js-cookie"; 
import Papa from "papaparse";

const baseURL = process.env.REACT_APP_API_BASE_URL; 
const REQUIRED_HEADERS = [
  "project", 
  "sponsor", 
  "sponsor email", 
  "instructor", 
  "instructor email"
]; 

const addTeam = async () => { //add paramaters
    try {
        const token = Cookies.get("token");
        const response = await fetch(`${baseURL}/api/teams/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            //team_name
            //sponsor
            //sponsor_email
            //instructor
            //instructor_email
        }),
        });

        const responseData = await response.json();
        console.log(responseData)

        if (!response.ok) {
        return { success: false, error: `Team Creation Failed for ${name}: ${responseData?.message || response.statusText}` };
        }

        return { success: true, data: responseData };

    } catch (error) {
        console.error("An error occurred during registration:", error);
        return { success: false, error: `Team Creation Failed for ${name}: ${error.message}` };
    }
};

const createTeam = async (teamData) => {
    const userData = {};
    REQUIRED_HEADERS.forEach((k) => {
        userData[k] = (row[k] ?? "").toString().trim();
    });

    //get attributes from row

    const result = await addTeam();
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
              transformHeader: (h) => h.trim(),
              transform: (value) => value.trim(),
              complete: (results) => {
                const rows = results.data || [];
                // create all users in parallel and wait for all results
                const createPromises = rows.map((row) => createTeam(row));
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

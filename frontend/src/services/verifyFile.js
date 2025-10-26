import Papa from "papaparse";

const REQUIRED_HEADERS = ["name", "canvas_user_id", "user_id", "login_id", "sections", "group_name", "canvas_group_id", "sponsor"]; // adjust to your required columns
const SCHEMA = {
    name: "string",
    canvas_user_id: "number",
    user_id: "number",
    login_id: "string",
    sections: "number",
    group_name: "string",
    canvas_group_id: "number",
    sponsor: "string",
};

const validateCell = (key, value) => {
    //console.log('validateCell called', { key, raw: JSON.stringify(value), typeof: typeof value });

    if (value == null) return `${key} is missing`;
    const v = String(value).trim();
    const normalizeDigits = (s) => String(s).replace(/[, \u00A0\r\n\t]+/g, '').trim();
    const normalized = normalizeDigits(v);

    //console.log('normalized for', key, ':', JSON.stringify(normalized)); // shows empty string clearly

    if (SCHEMA[key] === "number") {
    if (!/^\d+$/.test(normalized)) return `${key} must be an integer made only of digits`;
    return null;
    }
    if (v === "") return `${key} must be a non-empty string`;
    return null;
};


export const verifyFileService = (file) => {
    return new Promise((resolve) => {
    if (!file) return resolve({ valid: false, errors: ["No file provided"], rows: [] });

    const name = file.name?.toLowerCase?.() || "";
    if (!name.endsWith(".csv")) {
      return resolve({ valid: false, errors: ["Only CSV files are supported"], rows: [] });
    }

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
          console.log("Parsed data:", results.data);
        const errors = [];
        const headers = results.meta.fields || [];

        const missingHeaders = REQUIRED_HEADERS.filter(
          (h) => !headers.map(x => x.toLowerCase()).includes(h.toLowerCase())
        );
        if (missingHeaders.length) {
          errors.push(`Missing required header(s): ${missingHeaders.join(", ")}`);
        }

        const rows = results.data || [];
        rows.forEach((row, idx) => {
          
          REQUIRED_HEADERS.forEach((key) => {
            //console.log('DEBUG:', key, JSON.stringify(row[key]));
            const err = validateCell(key, row[key] ?? '');
            if (err) errors.push(`Row ${idx + 2}: ${err}`);
          });
        });

        resolve({ valid: errors.length === 0, errors, rows });
      },
      error: (err) => {
        resolve({ valid: false, errors: [String(err)], rows: [] });
      },
    });
  });
};


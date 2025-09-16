// import { Submission, UserRole } from './types';

import type { Submission } from "./utils/types";

// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'https://mediumaquamarine-eel-107102.hostingersite.com/app';


/**
 * Handles the login for a State Admin.
 */
export const loginAdmin = async (username: string, password: string) => {
  // This function would call your admin login endpoint
  // For now, we'll keep the mock logic as the PHP is not yet implemented
  if (username === 'Super Admin' && password === 'adminpassword') {
    return { success: true, user: { id: 1, name: 'Super Admin', role: 'State Admin' } };
  }
  return { success: false, message: 'Invalid credentials' };
};

/**
 * Handles the login for a Campus User by calling the live API.
 */
export const loginCampus = async (username: any, password: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, { // Assuming login endpoint is /login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    console.log(data)
    if (data.success) {
      return { success: true, user: data.data, token: data.data.token };
    }
    return { success: false, message: data.message || 'Login failed' };
  } catch (error) {
    console.error('Campus login error:', error);
    return { success: false, message: 'An network error occurred.' };
  }
};


/**
 * Fetches all campuses from the backend.
 */
export const getCampuses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getCampuses.php`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
        return data.data; // Return the array of campuses
    } else {
        console.error('API returned an error:', data.error);
        return [];
    }
  } catch (error) {
    console.error('Failed to fetch campuses:', error);
    return []; // Return an empty array on failure
  }
};

export const createCampus = async (campusData: { campus_id: string; campus_name: string; district: string; }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/createCampus.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campusData),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to create campus:', error);
    return { success: false, error: 'Network error while creating campus.' };
  }
};


/**
 * Generates a presigned URL for uploading a file to S3.
 */
export const generatePresignedUrl = async (fileName: any, fileType: any, token: any) => {
    const response = await fetch(`${API_BASE_URL}/generate_presigned_url.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fileName, fileType }),
    });
    return response.json();
};

/**
 * Uploads a file to the S3 bucket via our PHP API.
 * @param file The file to upload.
 * @returns The JSON response from the server, including the file URL.
 */
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/s3/api_upload.php`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('File upload failed:', error);
    return { success: false, error: 'File upload failed.' };
  }
};

/**
 * Creates a new submission or updates an existing one.
 * @param submissionData The data for the submission.
 * @returns The JSON response from the server.
 */
export const createOrUpdateSubmission = async (submissionData: Partial<Submission>) => {
    try {
        // Point to the new "upsert" script
        const response = await fetch(`${API_BASE_URL}/submissions/createSubmission.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to create or update submission:', error);
        return { success: false, error: (error as Error).message };
    }
};

/**
 * Fetches submissions from the backend.
 */
export const getSubmissions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/getSubmissions.php`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
        return data.data;
    } else {
        console.error('API returned an error:', data.error);
        return [];
    }
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return [];
  }
};

/**
 * Updates the status of a submission (approve/reject).
 */
export const updateSubmissionStatus = async (updateData: any, token: any) => {
    const response = await fetch(`${API_BASE_URL}/update_submission_status.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
    });
    return response.json();
};


// In api.ts
export const getRegisteredData = async (districtName: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/registrationData/getRegisteredData.php?district=${encodeURIComponent(districtName)}`);
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch registered data:', error);
    return []; // Return an empty array on failure
  }
};


export const getAllRegisteredData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/registrationData/getAllRegisteredData.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch all registered data:', error);
    return []; // Return an empty array on failure
  }
};



// evaluate submissions.
// In src/api.ts

export const evaluateSubmission = async (evaluationData: {
    id: number;
    status: 'approved' | 'rejected';
    marks: number | null;
    feedback: string;
    evaluated_by: string;
}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/submissions/evaluateSubmission.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evaluationData),
        });

        const text = await response.text(); // 👈 capture raw response
        let data: any;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(`Invalid JSON from server: ${text}`);
        }

        if (!response.ok || !data.success) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Failed to evaluate submission:', error);
        return { success: false, error: (error as Error).message };
    }
};



/**
 * Fetches registered member data from the previous year.
 * This function calls the getPastYearData.php script.
 * @returns {Promise<Array>} A promise that resolves to an array of data objects, or an empty array if an error occurs.
 */
export const getPastYearRegisteredData = async () => {
  try {
    // Construct the full URL to your PHP endpoint.
    // I'm assuming it might be in a 'registrationData' folder based on your other example.
    const response = await fetch(`${API_BASE_URL}/registrationData/getPastYearData.php`);

    // Check if the HTTP response status is OK (e.g., 200).
    if (!response.ok) {
      // If not, throw an error to be handled by the catch block.
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    // Parse the JSON body of the response and return it.
    return await response.json();
  } catch (error) {
    // Log any errors to the browser console for debugging.
    console.error('Failed to fetch past year registered data:', error);
    // Return an empty array as a safe fallback to prevent UI crashes.
    return [];
  }
};


// Global Registered Data Fetcher

export const getGlobalRegisteredData = async () => {
  try {
    // Construct the full URL to your PHP endpoint.
    // I'm assuming it might be in a 'registrationData' folder based on your other example.
    const response = await fetch(`${API_BASE_URL}/registrationData/getGlobalRegistration.php`);

    // Check if the HTTP response status is OK (e.g., 200).
    if (!response.ok) {
      // If not, throw an error to be handled by the catch block.
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    // Parse the JSON body of the response and return it.
    return await response.json();
  } catch (error) {
    // Log any errors to the browser console for debugging.
    console.error('Failed to fetch past year registered data:', error);
    // Return an empty array as a safe fallback to prevent UI crashes.
    return [];
  }
};
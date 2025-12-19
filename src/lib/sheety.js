// Sheety API utility for Google Sheets integration

const SHEETY_API_URL = process.env.NEXT_PUBLIC_SHEETY_API_URL;

export const saveToGoogleSheet = async (formData) => {
  try {
    if (!SHEETY_API_URL) {
      throw new Error('Sheety API URL not configured');
    }

    const response = await fetch(SHEETY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Sheety expects data wrapped in an object with your sheet name as key
        // Using 'sheet1' to match the API URL
        sheet1: {
          email: formData.email,
          fullName: formData.fullName,
          division: formData.division,
          rollNumber: formData.rollNumber,
          phoneNumber: formData.phoneNumber,
          timestamp: new Date().toISOString(),
          submittedAt: new Date().toLocaleString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const result = await response.json();
    console.log('Successfully saved to Google Sheet:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    return { success: false, error: error.message };
  }
};

// Function to save feedback to Google Sheet (feedback sheet)
export const saveToGoogleSheetFeedback = async (formData) => {
  try {
    // Use feedback sheet API URL - you'll need to set this up
    const FEEDBACK_API_URL = process.env.NEXT_PUBLIC_SHEETY_FEEDBACK_API_URL;
    
    if (!FEEDBACK_API_URL) {
      throw new Error('Sheety Feedback API URL not configured');
    }

    const response = await fetch(FEEDBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Sheety expects data wrapped in an object with your sheet name as key
        // Using 'feedback' to match the feedback sheet
        feedback: {
          email: formData.email,
          fullName: formData.fullName,
          division: formData.division,
          rollNumber: formData.rollNumber,
          satisfaction: formData.satisfaction,
          relevance: formData.relevance,
          keyTakeaways: formData.keyTakeaways,
          additionalComments: formData.additionalComments,
          suggestions: formData.suggestions,
          timestamp: new Date().toISOString(),
          submittedAt: new Date().toLocaleString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const result = await response.json();
    console.log('Successfully saved feedback to Google Sheet:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('Error saving feedback to Google Sheet:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Function to get all registrations from Google Sheet
export const getRegistrations = async () => {
  try {
    if (!SHEETY_API_URL) {
      throw new Error('Sheety API URL not configured');
    }

    const response = await fetch(SHEETY_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result.sheet1 || [] };

  } catch (error) {
    console.error('Error fetching from Google Sheet:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Function to get all feedback from Google Sheet
export const getFeedback = async () => {
  try {
    const FEEDBACK_API_URL = process.env.NEXT_PUBLIC_SHEETY_FEEDBACK_API_URL;
    
    if (!FEEDBACK_API_URL) {
      throw new Error('Sheety Feedback API URL not configured');
    }

    const response = await fetch(FEEDBACK_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result.feedback || [] };

  } catch (error) {
    console.error('Error fetching feedback from Google Sheet:', error);
    return { success: false, error: error.message };
  }
};
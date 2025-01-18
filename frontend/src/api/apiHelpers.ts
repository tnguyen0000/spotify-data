import dotenv from 'dotenv';

dotenv.config();

const PORT_BACK = process.env.PORT_BACK;

export const apiCallBody = async (inputMethod: string, path: string, requestBody: string) => {
  try {
    const data = await fetch(`http://localhost:${PORT_BACK}` + path, {
      method: inputMethod,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    return data.json();
  } catch (err) {
    return err;
  }
};

import axios from "axios";

const Apiurl = process.env.NEXT_PUBLIC_API_URL;

const checkSession = async () => {
  try {
    const res = await axios.get(`${Apiurl}/api/users/check-session`, {
      withCredentials: true,
    });
    console.log(`session check data: ${JSON.stringify(res.data)}`);

    return res.data;
  } catch (error) {
    console.log(`error while checking session: ${error}`);
    throw error;
  }
};

const signInUser = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      `${Apiurl}/api/users/signin`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    console.log(`sign in response data: ${JSON.stringify(res.data)}`);

    return res.data;
  } catch (error) {
    console.log(`error while signing in: ${error}`);
    throw error;
  }
};

const signUpUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post(
      `${Apiurl}/api/users/signup`,
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    console.log(`sign up response data: ${JSON.stringify(res.data)}`);
    return res.data;
  } catch (error) {
    console.log(`error while signing up: ${error}`);
    throw error;
  }
};

export { signInUser, signUpUser, checkSession };

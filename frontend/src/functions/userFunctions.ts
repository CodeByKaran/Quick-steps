import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Apiurl = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

const checkSession = async () => {
  try {
    const res = await axios.get(`${Apiurl}/api/users/check-session`);
    console.log(
      `session check data: ${JSON.stringify(res.data?.user?.username)}`
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("No session, returning null instead of throwing");
      return null; // treat as signed out
    }
    console.log(`error while checking session: ${error}`);
    throw error; // throw other unexpected errors
  }
};

const signInUser = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${Apiurl}/api/users/signin`, {
      email,
      password,
    });
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

const signoutUser = async () => {
  try {
    const res = await axios.post(`${Apiurl}/api/users/signout`);
    console.log(`sign out response data: ${JSON.stringify(res.data)}`);
    return res.data;
  } catch (error) {
    console.log(`error while signing out: ${error}`);
    throw error;
  }
};

export { signInUser, signUpUser, checkSession, signoutUser };

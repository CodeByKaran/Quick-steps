import axios from "axios";

const Apiurl = process.env.NEXT_PUBLIC_API_URL;

const fetchFeedSnipets = async (cursor?: {
  cursorId: number;
  cursorKey: string;
}) => {
  try {
    let url;
    if (cursor?.cursorId && cursor?.cursorKey) {
      url = `${Apiurl}/api/snippets/random?limit=6&cursorId=${cursor.cursorId}&orderby=asc&cursorKey=${cursor.cursorKey}`;
    } else {
      url = `${Apiurl}/api/snippets/random?limit=6&orderby=asc`;
    }
    const res = await axios.get(url);

    console.log("response data is : " + JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.log(`an error occured while fetching snippets ${error}`);
    throw new Error(`error: ${error}`);
  }
};

const getSnippet = async (id: number) => {
  try {
    const res = await axios.get(`${Apiurl}/api/snippets/${id}`);
    console.log("response data is : " + JSON.stringify(res, null, 2));
    return res;
  } catch (error) {
    console.log(`error while getting snipet for${id}`);
    throw new Error(`error:${error}`);
  }
};

const fetchSnipetComments = async (
  id: number,
  cursor?: { cursorId: number }
) => {
  try {
    let url;
    if (cursor?.cursorId) {
      url = `${Apiurl}/api/comment/${id}?limit=10&cursorId=${cursor.cursorId}&orderby=asc}`;
    } else {
      url = `${Apiurl}/api/comment/${id}?limit=10&orderby=asc`;
    }
    const res = await axios.get(url);

    console.log("response data is : " + JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.log(`an error occured while fetching snippet commets ${error}`);
    throw new Error(`error: ${error}`);
  }
};

const postComment = async (snippetId: number, commentText: string) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(
      `${Apiurl}/api/comment/${snippetId}`,
      { comment: commentText },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res.data;
  } catch (error) {
    // Re-throw the error to be handled by React Query
    throw error;
  }
};

export { fetchFeedSnipets, getSnippet, fetchSnipetComments, postComment };

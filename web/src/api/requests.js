import { authKey, client } from "./const";
import { redirect } from "react-router-dom";

export async function register({ username, password, email }) {
  console.log('Registering user:', { username, email });
  if (!username || !password || !email) {
    throw new Error("Please fill all fields");
  }
  const resp = await client.post("users/register", {
    json: { username, password, email },
  });
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg || "Registration failed");
  }
}

export async function confirmRegistration(username, code) {
  console.log('Confirming registration:', { username, code });
  if (!username || !code) {
    throw new Error("Username and verification code are required");
  }
  try {
    const resp = await client.post("users/confirm", {
      json: { username, code },
    });
    if (!resp.ok) {
      const respData = await resp.json();
      throw new Error(respData.msg || "Confirmation failed");
    }
    return resp.json();
  } catch (error) {
    console.error('Confirmation error:', error);
    throw error;
  }
}

export async function login({ username, password }) {
  console.log('Logging in user:', { username });
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  const resp = await client.post("users/login", {
    json: { username, password },
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg || "Login failed");
  }
  localStorage.setItem(authKey, respData.idToken);
  localStorage.setItem('accessToken', respData.accessToken);
  localStorage.setItem('refreshToken', respData.refreshToken);
}

function useAuthCheck(apiFunc) {
  return async function (...args) {
    const token = localStorage.getItem(authKey);
    if (!token) return redirect("/login");
    try {
      return await apiFunc(...args);
    } catch (error) {
      if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        localStorage.removeItem(authKey);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return redirect("/login");
      }
      throw error;
    }
  };
}

async function initCompressionTaskAPI(formData) {
  const videoFile = formData.get("videoFile");
  const videoName = formData.get("videoName").trim();

  if (videoFile?.size === 0 && videoName?.length === 0)
    throw new Error("Please upload or select a video to compress");
  const resp = await client.post("videos/compress", {
    body: formData,
  });
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.taskId;
}
export const initCompressionTask = useAuthCheck(initCompressionTaskAPI);

async function fetchProgressAPI(taskId) {
  const resp = await client.get(`videos/progress/${taskId}`);
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.progress;
}
export const fetchProgress = useAuthCheck(fetchProgressAPI);

async function fetchVideoListAPI() {
  const resp = await client.get("videos");
  const respData = await resp.json();
  if (!resp.ok) {
    throw new Error(respData.msg);
  }
  return respData.data;
}
export const fetchVideoList = useAuthCheck(
  fetchVideoListAPI
);

async function videoDownloadAPI(fileName) {
  const resp = await client.get(`videos/${fileName}`);
  if (!resp.ok) {
    const respData = await resp.json();
    throw new Error(respData.msg);
  }
  return await resp.blob();
}
export const videoDownload = useAuthCheck(videoDownloadAPI);
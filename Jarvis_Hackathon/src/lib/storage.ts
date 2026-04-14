
import { UserProfile } from "./types";

const STORAGE_KEY = "jarvis_elevate_users";

export const getLocalUser = (email: string): UserProfile | null => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return users[email] || null;
};

export const saveLocalUser = (email: string, profile: UserProfile) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  users[email] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const getCurrentSession = () => {
  const email = localStorage.getItem("jarvis_current_user");
  if (!email) return null;
  return { email, profile: getLocalUser(email) };
};

export const setCurrentSession = (email: string | null) => {
  if (email) {
    localStorage.setItem("jarvis_current_user", email);
  } else {
    localStorage.removeItem("jarvis_current_user");
  }
};

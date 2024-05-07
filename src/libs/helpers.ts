import { LOCAL_STORAGE } from "./constants";

export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(LOCAL_STORAGE, token);
  } else {
    localStorage.removeItem(LOCAL_STORAGE);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(LOCAL_STORAGE);
};

export const dataURLtoFile = (dataurl: any, filename: string) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const formatTime = (dateInput: string) => {
  const now = new Date();
  const date = new Date(dateInput);
  const daysAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);

  if (date >= daysAgo) {
    // const hours = date.getHours();
    const difference = now.getTime() - date.getTime();
    const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
    return hoursDifference === 0
      ? "Just Now"
      : `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
  } else {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = date.getMonth();
    const dayIndex = date.getDate();
    const dateIndex =
      dayIndex < 10 ? "0" + dayIndex.toString() : dayIndex.toString();
    const year = date.getFullYear();
    return `${dateIndex} ${monthNames[monthIndex]} ${year}`;
  }
};

export const addressShow = (str: string) => {
  if (!str || str.length < 8) {
    return "";
  }
  return str.slice(0, 4) + "..." + str.slice(-4);
};

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${hours}:${paddedMinutes}:${paddedSeconds}`;
};

export const formatK = (num: number) => {
  if (num < 1000) {
    return num;
  }

  const follows = (num / 1000).toFixed(1);

  if (parseInt(follows) == Number(follows)) {
    return parseInt(follows) + "K";
  }

  return follows + "K";
};

export const isPWA = () => {
  return (
    "serviceWorker" in navigator &&
    window.matchMedia("(display-mode: standalone)").matches
  );

  // return navigator.userAgent.includes('Android');
};

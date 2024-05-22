const createHuddleRoom = async (title: string) => {
  console.log("response");

  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY || "",
    },
  });

  const data = await response.json();

  const roomId = data.data.roomId;

  return roomId;
};

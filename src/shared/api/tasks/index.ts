import localAPI from "./local";
import serverAPI from "./server";

export const isLocal = import.meta.env.VITE_STATIC_BACKEND === "true";

const taskAPI = isLocal ? localAPI : serverAPI;

export default taskAPI;

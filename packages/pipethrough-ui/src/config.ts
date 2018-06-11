import * as Cookies from "js-cookie";

type Config = {
  PORT: number;
};

let config: Config | null = null;

const getCookie = () => JSON.parse(Cookies.get("_config") || "{}");

export const get = (): Config => {
  if (!config) {
    const c = getCookie();

    config = {
      PORT: c.PORT || 3000
    };
  }

  return config!;
};

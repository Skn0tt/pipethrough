type Mappings = { [key: string]: string }

import R from "ramda";

type Config = {
  IMAGE: string;
  PULL_IMAGE: boolean;
}

let config: Config | null = null;

export const get = (): Config => {
  if (!config) {
    const { IMAGE, PULL_IMAGE } = process.env;

    if (!IMAGE) {
      throw new Error("You must provide an IMAGE to pipe through.");
    }
    
    config = {
      IMAGE,
      PULL_IMAGE: !!R.defaultTo(true, PULL_IMAGE)
    }
  }

  return config!;
}
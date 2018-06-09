import * as R from "ramda";

type Config = {
  IMAGE: string;
  PULL_IMAGE: boolean;
  CMD?: string[];
};

let config: Config | null = null;

export const get = (): Config => {
  if (!config) {
    const { IMAGE, PULL_IMAGE, CMD: _CMD } = process.env;

    let CMD: string[] | undefined = undefined;
    if (!!_CMD) {
      const parsed = JSON.parse(_CMD);

      if (R.isArrayLike(parsed)) {
        CMD = parsed;
      }
    }

    if (!IMAGE) {
      throw new Error("You must provide an IMAGE to pipe through.");
    }

    config = {
      IMAGE,
      CMD,
      PULL_IMAGE: !!R.defaultTo(true, PULL_IMAGE)
    };
  }

  return config!;
};

import * as config from "./config";
import * as rest from "./rest";
import * as docker from "./docker";

rest.start();
docker.setup();

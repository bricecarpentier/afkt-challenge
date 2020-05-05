import * as Listr from "listr";
import * as awaitLoadBalancer from "./await-load-balancer";
import * as createCname from "./create-cname";

export const title = "Post-processing";

export const task = () => new Listr([awaitLoadBalancer, createCname]);

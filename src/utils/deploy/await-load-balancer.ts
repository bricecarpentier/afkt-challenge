import { exec } from "child_process";
import { promisify } from "util";
import filterEnv from "../filter-env";
import { Context } from "./types";

const execp = promisify(exec);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const title = "Awaiting load-balancer to be ready";

const getLoadBalancerCname = async () => {
  const stdout = (
    await execp("kubectl get service wpapp-service -o json", {
      env: filterEnv(process.env),
    })
  ).stdout;
  const output = JSON.parse(stdout);
  return output?.status?.loadBalancer?.ingress[0]?.hostname;
};

export const task = async (ctx: Context) => {
  let hostname: string = "";
  while (!hostname) {
    await delay(10000);
    hostname = await getLoadBalancerCname();
  }
  ctx.postProcess = {
    loadBalancerCname: hostname,
  };
};

import { exec } from "child_process";
import { resolveNs } from "dns";
import { promisify } from "util";
import { Context } from "./types";
import filterEnv from "../filter-env";

const execp = promisify(exec);
const resolveNsp = promisify(resolveNs);

export const title = "Ensure hosted zone is correctly setup";

// the following assumes sets of unique elements
const equal = (s1: string[], s2: string[]) => {
  if (s1.length !== s2.length) return false;
  return s1.filter((s: string) => !s2.includes(s)).length === 0;
};

export const task = async (ctx: Context) => {
  const domainName = ctx.args.domainName;
  const env = filterEnv(process.env);
  const stdout = (await execp("aws route53 list-hosted-zones", { env })).stdout;
  const output = JSON.parse(stdout);
  const zoneId = output.HostedZones.find(
    (zone: any) => zone.Name.replace(/\.$/, "") === domainName
  )?.Id;
  if (zoneId === undefined)
    throw new Error("we could not find a zone matching your domain on route53");

  const stdout2 = (
    await execp(`aws route53 get-hosted-zone --id ${zoneId}`, {
      env,
    })
  ).stdout;
  const output2 = JSON.parse(stdout2);
  const nameservers = output2?.DelegationSet?.NameServers;
  if (nameservers === undefined)
    throw new Error(
      `we could not fetch the nameservers from the hosted zone (${zoneId})`
    );
  const addresses = await resolveNsp(domainName);

  if (!equal(nameservers, addresses))
    throw new Error(
      "the zone does not seem to be properly configured. It may not have propagated yet?"
    );

  ctx.cert = {
    hostedZoneId: zoneId,
    domainName,
  };
};

import { exec } from "child_process";
import { promisify } from "util";
import filterEnv from "../filter-env";
import { Context } from "./types";

const execp = promisify(exec);

export const title = "Creating or updating CNAME";

const upsertRecordSet = async (
  zoneId: string,
  domainName: string,
  targetName: string
) => {
  const payload = {
    HostedZoneId: zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: domainName,
            Type: "CNAME",
            TTL: 1800,
            ResourceRecords: [{ Value: `${targetName}.` }],
          },
        },
      ],
    },
  };

  await execp(
    `aws route53 change-resource-record-sets --cli-input-json '${JSON.stringify(
      payload
    )}'`,
    { env: filterEnv(process.env) }
  );
};

export const task = async (ctx: Context) => {
  if (ctx.cert?.hostedZoneId === undefined)
    throw new Error("hosted zone id missing in context");
  if (ctx.postProcess?.loadBalancerCname === undefined)
    throw new Error("load balancer cname missing in context");
  await upsertRecordSet(
    ctx.cert.hostedZoneId,
    ctx.cert.domainName,
    ctx.postProcess?.loadBalancerCname
  );
};

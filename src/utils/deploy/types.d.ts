import Command from "@oclif/command";

export type Context = {
  cmd: Command;
  args: { [name: string]: any };
  flags: any;
  configDir?: string;
  terraformDir?: string;
  k8sDir?: string;
  vpc?: {
    vpcId: string;
    privateSubnets: string[];
    clusterName: string;
  };
  eks?: {
    sgId: string;
  };
  rds?: {
    databasePassword: string;
    databaseEndpoint: string;
    databaseUsername: string;
    databaseName: string;
    databasePort: string;
  };
  cert?: {
    hostedZoneId: string;
    domainName: string;
    zoneName: string;
    certArn?: string;
  };
  postProcess?: {
    loadBalancerCname: string;
  };
};

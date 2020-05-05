import * as Listr from "listr";
import * as prepareTerraformFiles from "./prepare-terraform-files";
import * as provisionCert from "./terraform-cert";
import * as provisionVpc from "./terraform-vpc";
import * as provisionEks from "./terraform-eks";
import * as provisionRds from "./terraform-rds";

export const title = "Terraform round 1";

export const task = () =>
  new Listr([
    prepareTerraformFiles,
    provisionCert,
    provisionVpc,
    provisionEks,
    provisionRds,
  ]);

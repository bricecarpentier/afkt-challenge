import * as Listr from "listr";
import * as prepareK8sDir from "./prepare-k8s-dir";
import * as kubectlRds from "./kubectl-rds";
import * as kubectlPods from "./kubectl-pods";
import * as kubectlDbSecret from "./kubectl-db-secret";
import * as kubectlExposePods from "./kubectl-expose-pods";
import * as kubectlApply from "./kubectl-apply";

export const title = "Kubectl";

export const task = () =>
  new Listr([
    prepareK8sDir,
    kubectlRds,
    kubectlDbSecret,
    kubectlPods,
    kubectlExposePods,
    kubectlApply,
  ]);

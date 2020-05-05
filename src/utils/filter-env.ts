const filterEnv = (env: NodeJS.ProcessEnv) => ({
  ...env, // @TODO: remove to provide efficient filtering and avoid environment spoofing
  AWS_REGION: env.AWS_REGION,
  DEFAULT_AWS_REGION: env.DEFAULT_AWS_REGION,
  AWS_PROFILE: env.AWS_PROFILE,
});

export default filterEnv;

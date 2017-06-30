import joi from 'joi';

const envVarsSchema = joi.object({
  NODE_ENV: joi.string();
  .allow(['development', 'production', 'test', 'provision'])
  .required()
}).unknown().required();

const {error, value: envVars} = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error for NODE_ENV: ${error.message}`);
}

const config = {
  common: {
    env: envVars.NODE_ENV,
    clientRootFolder: '/../client/build'
  }
};

module.exports = config;

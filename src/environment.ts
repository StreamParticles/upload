import dotenv from "dotenv-defaults";
import Joi from "joi";
import path from "path";

const validator = Joi.object({
  // AUTH SECURITY
  JWT_PASSPHRASE: Joi.string().required(),

  // DOCKER
  IS_RUNNING_ON_DOCKER: Joi.boolean(),

  // MONGODB
  MONGODB_HOST: Joi.string().required(),
  MONGODB_DBNAME: Joi.string().required(),
  MONGODB_USER: Joi.string(),
  MONGODB_PWD: Joi.string(),

  // MONGODB ENCRYPTION
  KEY: Joi.string().required(),
  IV: Joi.string().required(),

  // REDIS
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PWD: Joi.string().required(),

  // ENTRY_POINT
  API_PORT: Joi.number().required(),

  // ELROND
  ELROND_GATEWAY_URL: Joi.string().required(),
  ELROND_API_URL: Joi.string().required(),
  ELROND_HEROTAG_DOMAIN: Joi.string().required(),

  // IFTTT
  IFTTT_API: Joi.string().required(),

  // DEBUG
  ENABLE_CONSOLE_TRANSPORT: Joi.boolean(),

  // MEDIAS
  MEDIAS_FOLDER: Joi.string(),
});

const envFileName = () => {
  return [".env.docker", process.env.NODE_ENV === "test" && "test"]
    .filter(Boolean)
    .join(".");
};

// Load environment config
dotenv.config({
  encoding: "utf8",
  path: path.resolve(process.cwd(), envFileName()),
  defaults: path.resolve(process.cwd(), ".env.defaults"),
});

const ENV: { [key: string]: string | boolean | number } = Object.entries(
  process.env
).reduce((acc, [_key, _value]) => {
  //  null values
  if (_value === "null" || _value === undefined) return acc;

  // Convert booleans
  if (_value === "true") return { ...acc, [_key]: true };
  else if (_value === "false") return { ...acc, [_key]: false };

  if (isFinite(Number(_value)) && _value !== "")
    return { ...acc, [_key]: Number(_value) };

  return { ...acc, [_key]: _value };
}, {});

validator.validate(ENV);

// Expose environment vars
export { ENV };

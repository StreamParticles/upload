import dotenv from "dotenv-defaults";
import Joi from "joi";
import path from "path";

const validator = Joi.object({
  // ENTRY_POINT
  API_PORT: Joi.number().required(),

  // DEBUG
  ENABLE_CONSOLE_TRANSPORT: Joi.boolean(),

  // MEDIAS
  MEDIAS_FOLDER: Joi.string().required(),
}).unknown(true);

const envFileName = () => {
  return [".env", process.env.NODE_ENV === "test" && "test"]
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

const { error } = validator.validate(ENV);

if (error) throw error;

// Expose environment vars
export { ENV };

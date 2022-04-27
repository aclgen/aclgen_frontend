import { env } from "process";

export const host  = () => {
  if(process.env.NODE_ENV == "development"){
    return "http://localhost:8000";
  }else if(process.env.NODE_ENV == "production"){
    return "https://api.aclgen.com";
  }
}


export const realhost: string = "https://api.aclgen.com";

export const port: string = ":8000";

export const baseRoute: string = "/api/";

export function createAPIRoute(route: string) {
    return `${host()}${baseRoute}${route}`;
}
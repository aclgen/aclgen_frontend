import { env } from "process";

export const host: string = "http://localhost:8000";


export const realhost: string = "https://api.aclgen.com";

export const port: string = ":8000";

export const baseRoute: string = "/api/";

export function createAPIRoute(route: string) {
  if(env.NODE_ENV == "development"){
    return `${host}${baseRoute}${route}`;
  
  }else if(env.NODE_ENV == "production"){
    return `${realhost}${baseRoute}${route}`;
  }
}
  

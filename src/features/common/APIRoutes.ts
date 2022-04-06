export const host: string = "http://localhost";

export const port: string = ":8000";

export const baseRoute: string = "/api/";

export function createAPIRoute(route: string) {
  return `${host}${port}${baseRoute}${route}`;
}

// Where a user lands right after signing in.
// Everyone — clients and the administrator — starts on "Meu painel", the page that
// greets them by name. The admin area stays reachable from the header nav.
export function postLoginPath(_me: { isAdmin: boolean }): "/painel" {
  return "/painel";
}

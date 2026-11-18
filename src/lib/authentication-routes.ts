const authenticatedRoutePrefixes = [
  "/account",
  "/notifications",
  "/parent",
  "/payments",
  "/player",
  "/schedule",
];

export function requiresAuthenticatedUser(pathname: string): boolean {
  return authenticatedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

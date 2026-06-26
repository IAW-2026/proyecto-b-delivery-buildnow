declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role: "admin" | "delivery";
    };
  }
}

export {};

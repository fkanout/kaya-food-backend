export const RESTAURANTS = {
    BLUDAN_KAYA: "https://app.trybany.com/bludan-kayasehir-14h",
    FALAFEL_SARAYI: "https://app.trybany.com/falafel-sarayi-m",
    TAZEH_KASAP_KAYA: "https://app.trybany.com/en/taze-kasap-et-lokantasi-19a/categories/alshorbat-35i/products",
    KARADISH: "https://app.trybany.com/ar/mtaam-kradysh-15l",
    HAWA_MAHAL: "https://app.trybany.com/en/hawa-mahall-a/categories/biryani-aw/products",
  } as const;
  
  export type Restaurant = (typeof RESTAURANTS)[keyof typeof RESTAURANTS];
  
  
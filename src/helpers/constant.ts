export const RESTAURANTS_IDS = {
    BLUDAN_KAYA: "bludan-kayasehir-14h",
    FALAFEL_SARAYI: "falafel-sarayi-m",
    TAZEH_KASAP_KAYA: "taze-kasap-et-lokantasi-19a",
    KARADISH: "mtaam-kradysh-15l",
    HAWA_MAHAL: "hawa-mahall-a",
    ATA: "alata-et-f",
    BEIT_BEYRUT: "beitbeyrutgn",
    SAJ: "saj_falafel_pide"
} as const


export const RESTAURANTS_URL_BANY = {
    BLUDAN_KAYA: `https://app.trybany.com/${RESTAURANTS_IDS.BLUDAN_KAYA}`,
    FALAFEL_SARAYI: `https://app.trybany.com/${RESTAURANTS_IDS.FALAFEL_SARAYI}`,
    TAZEH_KASAP_KAYA: `https://app.trybany.com/${RESTAURANTS_IDS.TAZEH_KASAP_KAYA}`,
    KARADISH: `https://app.trybany.com/${RESTAURANTS_IDS.KARADISH}`,
    HAWA_MAHAL: `https://app.trybany.com/${RESTAURANTS_IDS.HAWA_MAHAL}`,
    ATA: `https://app.trybany.com/${RESTAURANTS_IDS.ATA}`,
} as const;


export const RESTAURANTS_URL_QRLIST = {
    BEIT_BEYRUT: `https://qrlist.app/api/category?store_id=93&store_type_id=1&limit=100&app_locale=ar`,
} as const;

export const RESTAURANTS_URL_LAMAZ = {
    SAJ: `https://saj.macho.menu/ar/osxzw-2fzue-tqqym`,
} as const;

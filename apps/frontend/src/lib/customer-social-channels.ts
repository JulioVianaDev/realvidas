import type {
    ContactChannel,
    ICustomerEntity,
} from "@global-types/entities/customer.entity-type";

const CHANNEL_ORDER: ContactChannel[] = [
    "WHATSAPP",
    "INSTAGRAM",
    "FACEBOOK",
    "TELEGRAM",
    "EMAIL",
    "PHONE",
];

const CHANNEL_ICON: Record<ContactChannel, string> = {
    WHATSAPP: "/social/whatsapp.svg",
    INSTAGRAM: "/social/instagram.svg",
    FACEBOOK: "/social/facebook.svg",
    TELEGRAM: "/social/telegram.svg",
    EMAIL: "/social/email.svg",
    PHONE: "/social/phone.svg",
};

const CHANNEL_LABEL: Record<ContactChannel, string> = {
    WHATSAPP: "WhatsApp",
    INSTAGRAM: "Instagram",
    FACEBOOK: "Facebook",
    TELEGRAM: "Telegram",
    EMAIL: "E-mail",
    PHONE: "Telefone",
};

/** Merges active contact identifiers with phone/e-mail fields for table display. */
export function mergeCustomerSocialChannels(
    customer: ICustomerEntity,
): ContactChannel[] {
    const set = new Set<ContactChannel>();
    for (const ci of customer.contactIdentifiers ?? []) {
        if (ci.isActive === false) continue;
        set.add(ci.channel);
    }
    if (customer.phone?.trim()) {
        if (!set.has("WHATSAPP") && !set.has("PHONE")) {
            set.add("PHONE");
        }
    }
    if (customer.email?.trim() && !set.has("EMAIL")) {
        set.add("EMAIL");
    }
    return CHANNEL_ORDER.filter((ch) => set.has(ch));
}

export function socialChannelIconSrc(channel: ContactChannel): string {
    return CHANNEL_ICON[channel] ?? "/social/generic.svg";
}

export function socialChannelLabel(channel: ContactChannel): string {
    return CHANNEL_LABEL[channel] ?? channel;
}

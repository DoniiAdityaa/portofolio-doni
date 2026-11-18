import { AtSignIcon, SendIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/features/contact/components/contact-form";
import { SocialGrid } from "@/features/contact/components/social-grid";
import { getSiteSettings } from "@/features/settings/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("contact") };
}

/**
 * Contact (Case 01 §5.6): the message form in a code-editor frame,
 * then email and social profiles as tiles.
 */
export default async function ContactPage() {
  const [settings, t, tNav, tPages] = await Promise.all([
    getSiteSettings(),
    getTranslations("contact"),
    getTranslations("nav"),
    getTranslations("pages"),
  ]);

  return (
    <div className="space-y-12">
      <PageHeader title={tNav("contact")} description={tPages("contact.description")} />

      <section aria-labelledby="form-title" className="space-y-5">
        <Reveal>
          <SectionHeader
            id="form-title"
            icon={SendIcon}
            title={t("form.title")}
            description={t("form.description")}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ContactForm />
        </Reveal>
      </section>

      <section aria-labelledby="channels-title" className="space-y-5">
        <Reveal>
          <SectionHeader
            id="channels-title"
            icon={AtSignIcon}
            title={t("channels.title")}
            description={t("channels.description")}
          />
        </Reveal>
        <SocialGrid links={settings.socialLinks} />
      </section>
    </div>
  );
}

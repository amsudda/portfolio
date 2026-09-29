import { CaseStudies } from "@/components/home/case-studies";
import { ClientMarquee } from "@/components/home/client-marquee";
import { Hero } from "@/components/home/hero";
import { Partnership } from "@/components/home/partnership";
import { Performance } from "@/components/home/performance";
import { Showreel } from "@/components/home/showreel";
import { StudioWorks } from "@/components/home/studio-works";
import { CtaBand } from "@/components/site/cta-band";
import { SiteFooter } from "@/components/site/footers";
import { SiteHeader } from "@/components/site/site-header";
import { OrganizationJsonLd } from "@/components/site/json-ld";
import { getHomeData } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

// Rebuilt in the background at most every 5 minutes; admin saves revalidate immediately.
export const revalidate = 300;

export default async function HomePage() {
  const [data, settings] = await Promise.all([getHomeData(), getSettings()]);

  return (
    <div className="overflow-x-clip bg-paper text-ink">
      <OrganizationJsonLd />
      <SiteHeader
        current="home"
        links={[
          { href: "#partnership", label: "Partnership" },
          { href: "#reel", label: "Showreel" },
          { href: "/portfolio", label: "Gallery" },
          { href: "#ads", label: "Performance" },
        ]}
      />
      <main>
        <Hero
          heroLoopUrl={settings.heroLoopUrl}
          heroPosterUrl={settings.heroPosterUrl}
          showTrustBar={settings.showTrustBar}
          clips={data.clips}
        />
        <ClientMarquee names={data.clientNames} />
        <Partnership />
        <CaseStudies projects={data.featured} />
        <Performance performance={data.performance} rows={data.rows} showBreakdown={settings.showAdsBreakdown} />
        <Showreel clips={data.clips} />
        <StudioWorks assets={data.assets} />
        {settings.showClosingCta && <CtaBand title="Tell us what the next quarter has to deliver." showRateCard />}
      </main>
      <SiteFooter />
    </div>
  );
}

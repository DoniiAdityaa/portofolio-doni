import { ArrowRightIcon, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeTag } from "@/components/ui/code-tag";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Lightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillIcon } from "@/components/ui/skill-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

/**
 * TEMPORARY (M1 only): shows every primitive on the dark palette for the owner's review.
 * Delete this file when M2 builds the real Home page. Text is intentionally not translated.
 */
const SAMPLE_SKILLS = [
  { slug: "flutter", name: "Flutter" },
  { slug: "dart", name: "Dart" },
  { slug: "laravel", name: "Laravel" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "vuedotjs", name: "Vue" },
  { slug: "supabase", name: "Supabase" },
  { slug: "firebase", name: "Firebase" },
  { slug: "unknown-skill", name: "Fallback icon" },
];

export function DesignPreview() {
  return (
    <div className="space-y-10">
      <PreviewSection title="Colors">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            ["Midnight", "bg-midnight"],
            ["Charcoal", "bg-charcoal"],
            ["Slate", "bg-slate"],
            ["Sky", "bg-sky"],
            ["Teal", "bg-teal"],
            ["Amber", "bg-amber"],
          ].map(([name, className]) => (
            <div key={name} className="space-y-1.5">
              <div className={`h-12 rounded-lg border ${className}`} />
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Buttons & badges">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">
            Ghost <ArrowRightIcon aria-hidden="true" />
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Featured</Badge>
          <Badge variant="secondary">Internship</Badge>
          <Badge variant="outline">In progress</Badge>
          <CodeTag>flutter</CodeTag>
          <CodeTag>laravel</CodeTag>
        </div>
      </PreviewSection>

      <PreviewSection title="Skill icons (grouped tabs)">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="flex flex-wrap gap-2 pt-3">
            {SAMPLE_SKILLS.map((skill) => (
              <SkillIcon key={skill.slug} {...skill} />
            ))}
          </TabsContent>
          <TabsContent value="mobile" className="flex flex-wrap gap-2 pt-3">
            {SAMPLE_SKILLS.slice(0, 2).map((skill) => (
              <SkillIcon key={skill.slug} {...skill} />
            ))}
          </TabsContent>
        </Tabs>
      </PreviewSection>

      <PreviewSection title="Cards & lightbox">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="transition-transform duration-200 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>PokeAtlas</CardTitle>
              <CardDescription>Pokémon encyclopedia app built with Flutter.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <CodeTag>flutter</CodeTag>
              <CodeTag>dart</CodeTag>
            </CardContent>
          </Card>
          <Lightbox
            title="Certificate preview"
            description="Opens in a modal; closes with Esc, the close button, or a click outside."
            trigger={
              <button
                type="button"
                className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <ImageIcon aria-hidden="true" className="size-6" />
                Open lightbox
              </button>
            }
          >
            <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              Certificate image
            </div>
          </Lightbox>
        </div>
      </PreviewSection>

      <PreviewSection title="Timeline">
        <Timeline>
          <TimelineItem
            title="Mobile Developer Intern"
            subtitle="Example Company"
            period="Jul 2025 – Present"
            badges={<Badge variant="secondary">Internship</Badge>}
            media={<div className="size-10 rounded-lg bg-secondary" aria-hidden="true" />}
          >
            Built Flutter features and shipped them to production.
          </TimelineItem>
          <TimelineItem title="Informatics" subtitle="Example University" period="2021 – 2025" />
        </Timeline>
      </PreviewSection>

      <PreviewSection title="Form fields">
        <div className="grid gap-3 sm:max-w-md">
          <Input placeholder="Your name" aria-label="Your name" />
          <Textarea placeholder="Message" aria-label="Message" />
        </div>
      </PreviewSection>

      <PreviewSection title="Loading & empty states">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border p-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <EmptyState title="Nothing here yet" description="Content will appear here." />
        </div>
      </PreviewSection>
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}

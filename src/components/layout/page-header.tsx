type PageHeaderProps = {
  title: string;
  description?: string;
};

/** Title and short description at the top of every public page. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="space-y-2 border-b pb-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {description ? <p className="text-muted-foreground">{description}</p> : null}
    </header>
  );
}

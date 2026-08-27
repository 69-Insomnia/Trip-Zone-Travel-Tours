import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/BookingCTA";
import { PageHero } from "@/components/PageHero";
import { blogs, getBlog } from "@/data/blogs";

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const blog = getBlog(params.slug);
    if (!blog) throw notFound();
    return blog;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Trip Zone` },
          { name: "description", content: loaderData.excerpt },
        ]
      : [],
  }),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const blog = Route.useLoaderData();
  const related = blogs.filter((item) => item.slug !== blog.slug).slice(0, 2);

  return (
    <>
      <article>
        <PageHero
          eyebrow={blog.category}
          title={blog.title}
          subtitle={blog.excerpt}
          image={blog.image}
          imageAlt={blog.title}
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/70 transition hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to all guides
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-accent" /> {blog.location}
            </span>
            <span>{blog.publishedAt}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-accent" /> {blog.readTime}
            </span>
          </div>
        </PageHero>
        <div className="container-page -mt-8 md:-mt-12">
          <img
            src={blog.image}
            alt={blog.title}
            className="aspect-[2/1] w-full rounded-[1.5rem] object-cover shadow-panel"
          />
        </div>
        <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="max-w-3xl">
            <p className="text-xl font-semibold leading-relaxed text-ink md:text-2xl">
              {blog.introduction}
            </p>
            <div className="mt-10 space-y-10">
              {blog.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-extrabold text-ink md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-28">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Plan this route
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Want a local team to arrange the vehicle, stops and timing?
            </p>
            <Button asChild variant="accent" className="mt-5 w-full">
              <Link to="/contact">
                Start planning <ArrowRight />
              </Link>
            </Button>
          </aside>
        </div>
      </article>
      <section className="section-y bg-surface">
        <div className="container-page">
          <h2 className="font-display text-2xl font-extrabold text-ink">More from the journal</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/blogs/$slug"
                params={{ slug: item.slug }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  {item.category}
                </span>
                <h3 className="mt-3 font-display text-xl font-extrabold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/data/blogs";

export function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/blogs/$slug"
        params={{ slug: blog.slug }}
        className="relative block aspect-[1.55] overflow-hidden"
      >
        <img
          src={blog.image}
          alt={blog.title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-primary backdrop-blur">
          {blog.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <span>{blog.publishedAt}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" /> {blog.readTime}
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl font-extrabold leading-snug text-ink">
          <Link to="/blogs/$slug" params={{ slug: blog.slug }} className="hover:text-primary">
            {blog.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{blog.excerpt}</p>
        <Link
          to="/blogs/$slug"
          params={{ slug: blog.slug }}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary"
        >
          Read guide <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

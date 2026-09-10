import { createFileRoute } from "@tanstack/react-router";
import { BlogCard } from "@/components/BlogCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { fetchBlogs } from "@/data/queries";
import { usePhoto } from "@/lib/content";
import { blogCollectionJsonLd, breadcrumbJsonLd, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/blogs/")({
  loader: () => fetchBlogs(),
  head: ({ loaderData }) => ({
    ...seoHead({
      title: "Nepal Travel Blog | Trip Zone Travel & Tours",
      description:
        "Practical Nepal destination guides, road-trip ideas, pilgrimage tips and local travel advice from Trip Zone.",
      path: "/blogs",
      // First-party, like every other route's card, and the same photo the
      // hero below renders.
      image: "/photos/pokhara.jpg",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blogs" }]),
        ),
      },
      // Ties every post on this page back to one Blog node, which is how the
      // individual BlogPosting pages get attributed to a publication.
      ...(loaderData?.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(blogCollectionJsonLd(loaderData)),
            },
          ]
        : []),
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const blogs = Route.useLoaderData();
  const hero = usePhoto("pokhara");

  return (
    <>
      <PageHero
        eyebrow="The Trip Zone journal"
        title="Ideas for your next Nepal journey."
        subtitle="Destination guides, route notes and practical tips to help you travel Nepal with more confidence."
        image={hero.src}
        imageAlt={hero.alt}
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "Blogs" }]} />
      </PageHero>
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Travel notes"
            title="Start with a useful idea"
            subtitle="Read the guide before you choose the route. We write about the details that make a journey smoother once you are on the road."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </section>
      <BookingCTA
        title="Have a route in mind?"
        subtitle="Tell us what you read, where you want to go and when you would like to travel."
      />
    </>
  );
}

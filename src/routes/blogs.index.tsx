import { createFileRoute } from "@tanstack/react-router";
import { BlogCard } from "@/components/BlogCard";
import { BookingCTA } from "@/components/BookingCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { blogs } from "@/data/blogs";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Nepal Travel Blog | Trip Zone Travel & Tours" },
      {
        name: "description",
        content:
          "Practical Nepal destination guides, road-trip ideas, pilgrimage tips and local travel advice from Trip Zone.",
      },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Trip Zone journal"
        title="Ideas for your next Nepal journey."
        subtitle="Destination guides, route notes and practical tips to help you travel Nepal with more confidence."
        image="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2200&q=88"
        imageAlt="Nepal valley and mountain road"
        imagePosition="center 48%"
      />
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

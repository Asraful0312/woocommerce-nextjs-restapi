import Wrapper from "@/components/shared/Wrapper";
import { Metadata } from "next";
import React from "react";

const defaultMetadata: Metadata = {
  title: "Contact",
  description: "This is contact page",
};

//fetch contact page
async function getSiteSettings() {
  const baseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/pages?slug=contact`;

  // Encode the username and password in base64
  const authHeader = Buffer.from(
    `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
  ).toString("base64");

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache data for 24 hours
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch settings: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate if the data exists and has the necessary properties
    if (data && data.length > 0 && data[0].title && data[0].content) {
      return data[0]; // Return the first item in the array
    } else {
      throw new Error("No valid data found.");
    }
  } catch (error) {
    console.error("Error fetching About data:", error);
    return null; // Return null if any error occurs
  }
}

// fetch yoast metadata
export async function generateMetadata(): Promise<Metadata> {
  let site;
  try {
    site = await getSiteSettings();
  } catch (error) {
    console.error("Failed to fetch site info:", error);
    return defaultMetadata;
  }

  return {
    title: site?.yoast_head_json?.title || defaultMetadata.title,
    description:
      site?.yoast_head_json?.og_description || defaultMetadata.description,
    openGraph: {
      title: site?.yoast_head_json?.og_title || defaultMetadata.title,
      description:
        site?.yoast_head_json?.og_description || defaultMetadata.description,
      url: site?.yoast_head_json?.og_url,
      siteName: site?.yoast_head_json?.og_site_name,
      images:
        site?.yoast_head_json?.og_image?.map((image: any) => ({
          url: image.url,
          width: image.width,
          height: image.height,
        })) || [],
      type: site?.yoast_head_json?.og_type || "website",
    },
    twitter: {
      card: site?.yoast_head_json?.twitter_card || "summary_large_image",
    },
  };
}

export default async function ContactPage() {
  const aboutData = await getSiteSettings();

  if (!aboutData) {
    return (
      <Wrapper className="py-6">
        <h1 className="text-3xl font-bold">Contact Page</h1>
        <p className="mt-4">
          Sorry, we couldn&rsquo;t load the about information at this time.
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper className=" py-6">
      <h1 className="text-3xl font-bold">{aboutData?.title?.rendered}</h1>
      <div
        className="prose mt-4"
        dangerouslySetInnerHTML={{
          __html: aboutData?.content?.rendered,
        }}
      />
    </Wrapper>
  );
}

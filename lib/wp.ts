export async function getSiteInfo() {
  const authHeader = btoa(
    `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
  );
  const baseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}`;

  // Fetch site settings
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/settings`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
  }); // No caching for fresh data
  if (!res.ok) {
    throw new Error("Failed to fetch site info");
  }

  const data = await res.json();

  // Fetch site logo if it exists
  let logoUrl = null;
  if (data.site_logo) {
    const logoRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/media/${data.site_logo}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 60,
        },
      }
    );
    if (logoRes.ok) {
      const logoData = await logoRes.json();
      logoUrl = logoData.source_url;
    }
  }

  // Fetch site icon (favicon) if it exists
  let iconUrl = null;
  if (data?.site_icon) {
    const iconRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/media/${data.site_icon}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 60,
        },
      }
    );
    if (iconRes.ok) {
      const iconData = await iconRes.json();
      iconUrl = iconData.source_url;
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
  const [settingsRes, yoastRes] = await Promise.all([
    fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
      method: "GET",
      next: {
        revalidate: 60,
      },
    }),
    fetch(`${siteUrl}/wp-json/yoast/v1/get_head?url=${siteUrl}`, {
      method: "GET",
      next: {
        revalidate: 60,
      },
    }),
  ]);

  const settings = await settingsRes.json();
  const yoast = await yoastRes.json();

  return {
    title: data.title,
    description: data.description,
    email: data.email,
    logo: logoUrl,
    siteIcon: iconUrl,
    settings,
    yoast,
  };
}

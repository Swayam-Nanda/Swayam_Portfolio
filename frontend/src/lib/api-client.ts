export const BASE_URL = import.meta.env.VITE_API_URL || "";
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || "";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const csrftoken = getCookie("csrftoken");
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`API Error on ${endpoint}:`, response.statusText);
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

let heroPortraitsPromise: Promise<Record<string, string>> | null = null;

export const api = {
  getHero: () => apiFetch("/hero/"),
  getHeroPortraits: () => {
    if (!heroPortraitsPromise) {
      heroPortraitsPromise = apiFetch("/hero/portraits/").catch((err) => {
        heroPortraitsPromise = null;
        throw err;
      });
    }
    return heroPortraitsPromise;
  },
  getAbout: () => apiFetch("/about/"),
  getServices: () => apiFetch("/services/"),
  getProjects: () => apiFetch("/projects/"),
  getExperience: () => apiFetch("/experience/"),
  getAvatars: () => apiFetch("/avatars/"),
  getTestimonials: () => apiFetch("/testimonials/"),
  postTestimonial: (data: any) =>
    apiFetch("/testimonials/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  postBooking: (data: any) =>
    apiFetch("/bookings/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  postContact: (data: any) =>
    apiFetch("/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getTheme: () => apiFetch("/theme/"),
};

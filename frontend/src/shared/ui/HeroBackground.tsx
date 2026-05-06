const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLujYk4JuKt3WimFzj-zl0GzryOrpmtA-IO-ZV_oly6raBjzPVaWozqE3FSS4Ryx2k-X6OJvSdYX7rdf-04Lb5tFgZZT623AVKvZDgV1RtjmEErlYphH0aTPoXgEx6Ei0B2EESiM2GUiLyfaMGFYakz4BSrtEn1-rQq5hbRhd2zMPdM3_RlnGtAJXzbjgHsLGVthByhChlqQwRwec_9Aev9eQNjAx3Mwi3CK2SAdg9l9nZoAojhvx4eKHvdFwNw-rSonPnzhYH4wg";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <img alt="Aerial view" className="w-full h-full object-cover" src={heroImage} />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
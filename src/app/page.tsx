import GlobalNav from "./components/GlobalNav";
import HeroSection from "./components/HeroSection";
import Page2 from "./components/Page2";

export default function Home() {
  return (
    <main id="main-scroll-container" className="w-full relative bg-black">
      {/* Persistent Global Nav Header — animated title and responsive links */}
      <GlobalNav scrollTriggerTrigger="#main-scroll-container" />

      {/* Sticky viewport pinned smoothly for the duration of the scroll animation */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Page 2 is layered underneath at z-10 */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <Page2 />
        </div>

        {/* HeroSection is layered on top at z-20 and slides up out of the viewport */}
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
          <HeroSection scrollTriggerTrigger="#main-scroll-container" />
        </div>
      </div>

      {/* Scroll track that provides the smooth scroll distance (220vh) */}
      <div className="h-[220vh] w-full pointer-events-none" />
    </main>
  );
}

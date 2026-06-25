import { createFileRoute } from "@tanstack/react-router";
import LorenzoInteractivePortrait from "@/components/landonorris";
import portrait from "@/assets/portrait-blue.png";
import portraitAlt from "@/assets/portrait-alt.png";

export const Route = createFileRoute("/lando")({
  component: LandoPage,
});

function LandoPage() {
  return (
    <div className="h-screen w-full bg-black">
      <LorenzoInteractivePortrait
        baseImageUrl={portrait}
        revealImageUrl={portraitAlt}
        backgroundColor="#000000"
        blobRadius={0.4}
        blobFadeSpeed={1.5}
        colorBgVec3="0.1, 0.1, 0.1"
        colorSoftShapeVec3="0.2, 0.2, 0.2"
        colorLineVec3="0.3, 0.3, 0.3"
      />
    </div>
  );
}

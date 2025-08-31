import Navbar from "@/components/nav-bar";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <Navbar />
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
        {/* Example Cards */}
        {[
          { title: "Button", description: "Primary and secondary buttons" },
          { title: "Card", description: "Container card with shadow" },
          { title: "Modal", description: "Dialog and overlay components" },
          { title: "Form", description: "Inputs, checkboxes and selects" },
          { title: "Tabs", description: "Animated tab navigation" },
          { title: "Tooltip", description: "Hover and focus tooltips" },
          { title: "Button", description: "Primary and secondary buttons" },
          { title: "Card", description: "Container card with shadow" },
          { title: "Modal", description: "Dialog and overlay components" },
          { title: "Form", description: "Inputs, checkboxes and selects" },
          { title: "Tabs", description: "Animated tab navigation" },
          { title: "Tooltip", description: "Hover and focus tooltips" },
          { title: "Button", description: "Primary and secondary buttons" },
          { title: "Card", description: "Container card with shadow" },
          { title: "Modal", description: "Dialog and overlay components" },
          { title: "Form", description: "Inputs, checkboxes and selects" },
          { title: "Tabs", description: "Animated tab navigation" },
          { title: "Tooltip", description: "Hover and focus tooltips" },
        ].map(({ title, description }, i) => (
          <div
            key={i}
            className="bg-card-bg border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

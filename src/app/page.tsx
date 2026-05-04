import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <h1 className="text-4xl font-bold">Resolve Home</h1>
      </div>

      <div className="mt-8">
        <p className="text-xl text-muted-foreground">
          Welcome to the future of home services.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}

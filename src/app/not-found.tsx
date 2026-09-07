import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-deep">
        Page not found
      </p>
      <h1 className="mt-3 text-4xl">This page has moved on.</h1>
      <p className="mt-3 max-w-md text-stone">
        The page you were looking for isn&rsquo;t here. Let&rsquo;s get you back to something useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Return home</Button>
        <Button href="/packages" variant="outline">
          View packages
        </Button>
        <Button href="/contact" variant="ghost">
          Contact us
        </Button>
      </div>
      <p className="mt-8 text-sm text-mist">
        Need help now?{" "}
        <Link href="/arrange-a-funeral" className="underline">
          Arrange a funeral
        </Link>
      </p>
    </Container>
  );
}

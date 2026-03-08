"use client";

import Link from "next/link";
import { Mail, Facebook } from "lucide-react";
import Logo from "@/components/logo";

function Footer() {

  return (
    <footer className="relative mt-16 sm:mt-20 md:mt-24 border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center">
            <Logo url="/" />
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {/* Support Email */}
            <Link
              href="mailto:info@platvo.com"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>info@platvo.com</span>
            </Link>

            {/* Facebook Link */}
            <Link
              href="https://www.facebook.com/getplatvo?mibextid=wwXIfr&rdid=muorrAtTGng1Rmwp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Dmpy2NoCG%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Platvo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import {
  TLDRBlock,
  CitationBlock,
  ExpertQuote,
  DataTable,
  FAQItem,
  LastUpdated,
} from "./geo-components";
import { BlogCTA } from "./blog-cta";

function MdxImage(props: React.ComponentProps<"img">) {
  const { src, alt, width, height } = props;
  if (!src || typeof src !== "string") return null;

  if (src.startsWith("http")) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={Number(width) || 800}
        height={Number(height) || 450}
        className="rounded-lg my-6"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt || ""} className="rounded-lg my-6" />;
}

function MdxLink(props: React.ComponentProps<"a">) {
  const { href, children, ...rest } = props;
  if (!href) return <span {...rest}>{children}</span>;

  if (href.startsWith("/")) {
    return <Link href={href} {...rest}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  // GEO components
  TLDRBlock,
  CitationBlock,
  ExpertQuote,
  DataTable,
  FAQItem,
  LastUpdated,
  BlogCTA,
};

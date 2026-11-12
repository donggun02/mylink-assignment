import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "김동건 | MyLink", description: "김동건의 프로필과 링크를 한곳에서 만나보세요." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}

import "./globals.css";

export const metadata = {
  title: "Todo App - skiprez",
  description: "Todo App made by skiprez!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

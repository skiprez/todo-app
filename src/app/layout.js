import "./globals.css";

export const metadata = {
  title: "Todo App - skiprez",
  description: "Todo App made by skiprez!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center mt-[170px] bg-gray-600">
        {children}
      </body>
    </html>
  );
}

import { ReactNode } from "react";
import Providers from "./components/Providers";
import AuthStatus from "./AuthStatus";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          <AuthStatus/>
          {children}
        </Providers>
      </body>
    </html>
  );
}

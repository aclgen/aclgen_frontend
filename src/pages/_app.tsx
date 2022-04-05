import "../styles/globals.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import store from "../app/store";
import { ThemeProvider } from "next-themes";
import { DndContext } from "@dnd-kit/core";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DndContext>
        <ThemeProvider enableSystem={true} attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </DndContext>
    </Provider>
  );
}

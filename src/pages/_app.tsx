import "../styles/globals.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import store from "../app/store";
import { ThemeProvider } from "next-themes";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export default function MyApp({ Component, pageProps }: AppProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });

  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  return (
    <Provider store={store}>
      <DndContext sensors={sensors} collisionDetection={pointerWithin}>
        <ThemeProvider enableSystem={true} attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </DndContext>
    </Provider>
  );
}

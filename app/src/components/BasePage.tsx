import { Slot } from "expo-router";

export default function HomeLayout() {
  // TODO: build header and footer
  return (
    <>
      <header />
      <Slot />
      <footer />
    </>
  );
}

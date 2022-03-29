import { NextPage } from "next";
import ListView from "./ListView";
import BasePage from "../../components/basepage";
import Head from "next/head";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rules</title>
        <link rel="icon" href="/sikt_small.svg" />
      </Head>
      <BasePage Child={ListView} />
    </>
  );
};

export default Index;

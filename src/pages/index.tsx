import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/navbar";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectRepository,
  selectRepositoryAsync,
  updateRepositoriesAsync,
} from "../features/repository/repositorySlice";
import { useEffect } from "react";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRepository);

  useEffect(() => {
    if (state.repositories.length == 0 && state.status == "empty") {
      dispatch(updateRepositoriesAsync());
    }
  }, [state.status, state.selectedRepository]);
  return (
    <div className={styles.container}>
      <Head>
        <title>ACLGen</title>
        <link rel="icon" href="/sikt_small.svg" />
      </Head>
      <Navbar />
      <header className={styles.header}>
        <div className={"h-64 w-32"}>
          <Image
            src="/sikt_small.svg"
            className={styles.logo}
            alt="logo"
            width={100}
            height={100}
            layout={"intrinsic"}
          />
        </div>
        <div className={"flex flex-col space-y-6 w-96 items-center"}>
          <h2 className="text-gray-800 pb-8">Repositories</h2>

          {state.repositories.map((element, i) => {
            return (
              <Link key={i} href={"/rules"} passHref>
                <div
                  className={
                    "rounded-md shadow-md w-full hover:cursor-pointer hover:bg-blue-500 hover:text-white border-2  border-blue-500 text-gray-800 p-4"
                  }
                >
                  {element.name}
                </div>
              </Link>
            );
          })}
        </div>
      </header>
    </div>
  );
};

export default IndexPage;

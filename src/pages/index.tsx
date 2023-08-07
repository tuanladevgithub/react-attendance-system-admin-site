import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/teacher");
  }, [router]);
  return <Layout>Home page</Layout>;
};

export default Home;

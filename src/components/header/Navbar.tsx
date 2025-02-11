"use client";
import Link from "next/link";
import { GrTechnology } from "react-icons/gr";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import styles from "./header.module.css";
import { useState } from "react";

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar = ({ isAdmin }: NavbarProps) => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div>
        <Link href={"/"} className={styles.logo}>
          CLOUD
          <GrTechnology />
          HOSTING
        </Link>
        <div className={styles.menu} onClick={() => setToggle((prev) => !prev)}>
          {toggle ? <IoMdClose /> : <AiOutlineMenu />}
        </div>
      </div>
      <div
        className={styles.navLinksWrapper}
        style={{
          clipPath:
            (toggle && " polygon(0 0, 100% 0, 100% 100%, 0 100%)") || "",
        }}
      >
        <ul className={styles.navLinks}>
          <Link
            onClick={() => setToggle(false)}
            className={styles.navLink}
            href={"/"}
          >
            Home
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={styles.navLink}
            href={"/articles?pageNumber=1"}
          >
            Articles
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={styles.navLink}
            href={"/about"}
          >
            About
          </Link>
          {isAdmin && (
            <Link
              onClick={() => setToggle(false)}
              className={styles.navLink}
              href={"/admin"}
            >
              Admin Dashboard
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

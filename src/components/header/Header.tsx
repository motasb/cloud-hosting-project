import Link from "next/link";
import styles from "./header.module.css";
import Navbar from "./Navbar";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import LogoutButton from "./LogoutButton";
const Header = async () => {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const user = verifyTokenForPage(token);
  return (
    <header className={styles.header}>
      <Navbar isAdmin={user?.isAdmin || false} />
      <div className={styles.right}>
        {user ? (
          <>
            <strong className="text-blue-800 md:text-xl capitalize">
              {user?.username}
            </strong>
            <LogoutButton/>
          </>
        ) : (
          <>
            <Link className={styles.btn} href={"/login"}>
              Login
            </Link>
            <Link className={styles.btn} href={"/register"}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

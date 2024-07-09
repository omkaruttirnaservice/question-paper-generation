import { Link, NavLink } from "react-router-dom";
import useMenuCtx from "../../hooks/useMenuCtx.js";

import logo from "../../images/codedrift-logo.png";
import { GoBell } from "react-icons/go";
import { TiThMenuOutline } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";

export default function MainMenuBar() {
  const { showMenu, toggleMenu } = useMenuCtx();

  if (showMenu) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "unset";

  return (
    <>
      {showMenu && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-[50]"
          onClick={toggleMenu}></div>
      )}
      <div className="c-container__1 flex justify-between items-center px-7 relative z-[55]">
        <Link to={"/dashboard"}>
          <img
            src={logo}
            alt=""
            className="w-10"
          />
        </Link>

        <div className="flex gap-5">
          <GoBell className="text-2xl" />
          {!showMenu && (
            <TiThMenuOutline
              className="text-2xl"
              onClick={toggleMenu}
            />
          )}

          {showMenu && (
            <AiOutlineClose
              className="text-2xl"
              onClick={toggleMenu}
            />
          )}
        </div>

        <div
          className={`

            ${
              showMenu ? `` : `hidden`
            } z-[60] absolute bg-white h-fit  w-[90%] right-0 rounded-tl-3xl rounded-bl-3xl py-5 px-3 -bottom-[9rem] border shadow-2xl`}>
          <div className=" grid gap-4 ps-6">
            <div>
              <NavLink
                to={"/profile"}
                onClick={toggleMenu}>
                Profile
              </NavLink>
            </div>
            <div>
              <NavLink
                to={"/dashboard"}
                onClick={toggleMenu}>
                Dashboard
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
